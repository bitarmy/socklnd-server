/**
 * ApiKey.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import crypto from 'crypto';


const MAX_SECONDS_EMPIRY = {
  user: 60 * 60 * 24 * 365, // year
  invited: 60 * 5,    // 5 minutes
};

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

    expires: { // Converted to timestamp beforeCreate
      type: 'number', // Seconds
      defaultsTo: 3600,
      isInteger: true
    }

  },

  beforeCreate: async function(apiKey, cb) {
    const seconds = Math.max(Math.min(apiKey.expires, MAX_SECONDS_EMPIRY[apiKey.category]), 60);
    apiKey.token = apiKey.category + '_' + await generateTokenHash();
    apiKey.expiry = getTimeFromExpire(seconds);
    cb();

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
      sails.log.warn(e.details);
      return null;
    }

    return apiKey !== undefined ? apiKey : null;
  }

};

function getTimeFromExpire(seconds) {
  return Math.floor((new Date()).valueOf()/1000) + seconds;
}


function generateTokenHash(size) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size ? size: 16, function(err, buffer) {
      if (err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}
