/**
 * Node.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import flaverr from 'flaverr';

module.exports = {

  attributes: {

    host: {
      type: 'string',
      required: true,
      example: 'localhost:10009',
    },

    certPath: {
      type: 'string',
      //required: true,
      defaultsTo: '/Users/agustinkassis/Development/.lnd/tls.cert',
    },

    macaroonPath: {
      type: 'string',
      //required: true,
      defaultsTo: '/Users/agustinkassis/Development/.lnd/data/chain/bitcoin/regtest/admin.macaroon'
    },

    password: {
      type: 'string',
      //required: true,
    },

    status: {
      type: 'string',
      //required: true,
      isIn: ['connected', 'connecting', 'disconnected'],
      defaultsTo: 'disconnected',
    },

    users: {
      collection: 'user',
      via: 'nodes',
    },

    apiKeys: {
      collection: 'apiKey',
      via: 'nodes',
    },

  },

  beforeCreate: (node, cb) => {
    node.status = 'disconnected';
    if (node.users.length === 0) {
      cb(flaverr({
        message: 'Must have at least 1 user',
        code: 'E_MISSING_USER'
      }));
      return;
      //cb('Must have at least 1 user');
    }
    cb();
  },

  connect: async (node) => {
    const lnd = sails.hooks.lnd;
    sails.log.info('Connecting Node Model', node.id);
    await lnd.connectNode(node);
    return 'Good Baby!';
  },

};
