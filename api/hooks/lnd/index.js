/**
 * lnd hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */


const LndGrpc = require('lnd-grpc');

const defaultConfig = {
  maxInstances: 10,
};

module.exports = function defineLndHook(sails) {
  const activeGrpcIndex = {};

  return {
    initialize: async function() {
      sails.log.info('Initializing LND hook');

      sails.on('hook:orm:loaded', async function() {
        sails.log.info('Setting all Nodes to "disconnected" status');
        await Node.update({}).set({status:"disconnected"});
      });
    },

    configure: function() {
      this.config = _.defaults(defaultConfig, sails.config.lnd);

      if (this.config.maxInstances == 0) {
        this.config.maxInstances = Infinity;
      }
    },

    hasConnection: function (nodeId) {
      return nodeId in activeGrpcIndex;
    },

    createGrpc: function (node) {
      sails.log.info('Creating new Grpc');
      const options = {
        host: node.host,
        cert: node.certPath,
        macaroon: node.macaroonPath,
      };
      return new LndGrpc(options);
    },

    connectNode: async function (node) {
      if (_.size(activeGrpcIndex) >= this.config.maxInstances) {
        throw 'Can\'t create Grpc, Max instances of (' + this.config.maxInstances + ') reached. You can increase the value on sails.config.maxInstances';
      }
      const grpc = this.hasConnection(node.id) ? activeGrpcIndex[node.id] : await this.createGrpc(node);
      await connectGrpc(grpc, node);
      activeGrpcIndex[node.id] = grpc;
    },

    getIndex: function () {
      return activeGrpcIndex;
    },

    removeNode: function (nodeId) {
      delete activeGrpcIndex[nodeId];
    },


  };

};


async function connectGrpc(grpc, node) {
  sails.log.info('Connecting to Lnd via Grpc...');
  onConnecting.call(grpc, node.id);
  await grpc.connect();

  onConnect(node.id);
  await verifyLock(grpc, node);
  initGrpcSubscriptions(grpc, node.id);
}

async function getGrpcInfo(grpc, nodeId) {
  return await grpc.services.Lightning.getInfo();
}

async function verifyLock(grpc, node) {
  sails.log.info('Verifying lock');
  const { WalletUnlocker } = grpc.services;
  if (grpc.state === 'locked') {
    if (!node.password) {
      throw 'Unable to unlock wallet, not password provided for node';
    }
    try {
      sails.log.info('Unlocking wallet');
      await WalletUnlocker.unlockWallet({ wallet_password: Buffer.from(node.password) });
      await grpc.activateLightning();
    } catch (e) {
      throw _.upperFirst(e.details);
    }
  }
  sails.log.info('Wallet unlocked');
  return true;
}

async function initGrpcSubscriptions(grpc, nodeId) {
  sails.log.info('Subscribing for invoice events...');
  let request = {
    //add_index: 0,
    //settle_index: 0,
  };
  let call = grpc.services.Lightning.subscribeInvoices(request);
  call.on('data', onInvoice.bind(grpc, nodeId));
  call.on('status', onStatus.bind(grpc, nodeId));
}


/***************************************************************************
*                                                                          *
*                             Event Listeners                              *
*                                                                          *
***************************************************************************/


/** @this grpc */
function onNewInvoice(nodeId, invoice) {
  sails.log.info('New Invoice for node', nodeId);
  sails.log.info('PayReq', invoice.payment_request);
}

/** @this grpc */
function onSettledInvoice(nodeId, invoice) {
  const paymentRequest = invoice.r_hash.toString('hex');

  sails.log.info('Settled Invoice for node', nodeId);
  sails.log.info('PayReq', paymentRequest);

  sails.sockets.broadcast([
    'invoice:' + paymentRequest,
    'node:' + nodeId,
  ], 'payment', invoice);
}

/** @this grpc */
function onInvoice(nodeId, invoice) {
  const functionList = {
    'open': onNewInvoice,
    'settled': onSettledInvoice,
  };
  const state = invoice.state.toLowerCase();
  ({}).propertyIsEnumerable.call(functionList, state) && functionList[state].call(this, nodeId, invoice);
}

/** @this grpc */
function onStatus(nodeId, status) {
  // The current status of the stream.
  sails.log.info('Status on node ' + nodeId);
  sails.log.debug(status);
  status.code === 0 && onDisconnect.call(this, nodeId, status.details);
}

/** @this grpc */
function onError(nodeId, err) {
  sails.log.error('Error on node : ' + nodeId);
  sails.log.error('Error : ' + err);
}

/** @this grpc */
function onConnectionError(nodeId, err) {
  sails.log.error('Connection Error for node ' + nodeId);
  sails.log.error(err);
}


/** @this grpc */
function onConnecting(nodeId) {
  sails.log.info('Connecting to node ' + nodeId);
  Node.update({id:nodeId}, {status:'connecting'}).then();
}


/** @this grpc */
function onConnect(nodeId) {
  sails.log.info('Connected to node ' + nodeId);
  Node.update({id:nodeId}, {status:'connected'}).then();
}

/** @this grpc */
function onDisconnect(nodeId) {
  sails.log.info('Disconnected from node ' + nodeId);
  Node.update({id:nodeId}, {status:'disconnected'}).then();
  sails.hooks.lnd.removeNode(nodeId);
}
