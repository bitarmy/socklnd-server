/**
 * ApiKey.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import crypto from 'crypto';

module.exports = {

  attributes: {

    owner: {
      model: 'user',
      required: true,
    },

    category: {
      type: 'string',
      isIn: ['user', 'invited'],
      required: true,
    },

    nodes: {
      collection: 'node',
      via: 'apiKeys',
    },

    token: {
      type: 'string',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  beforeCreate: function(apiKey, cb) {
    crypto.randomBytes(16, function(err, buffer) {
      if (err) return cb(err);
      apiKey.token = apiKey.category + '_' + buffer.toString('hex');
      cb();
    });
  },

  get: async function (token) {
    let apiKey;
    if (!token) {
      throw 'Must provide a token';
    }
    const criteria = {
      token:token
    };

    try {
      apiKey = await ApiKey.findOne(criteria);
    } catch (e) {
      console.log.warn(e.details);
      //console.dir(e);
      return null;
    }

    return apiKey !== undefined ? apiKey : null;
  }

};
