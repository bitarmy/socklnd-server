/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import bcrypt from 'bcrypt';

module.exports = {

  attributes: {

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'agustin@coinmelon.com'
    },

    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    isSuperAdmin: {
      type: 'boolean',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
    },

    nodes: {
      collection: 'node',
      via: 'users',
    },

    apiKeys: {
      collection: 'apiKey',
      via: 'owner',
    },
  },
  customToJSON: function() {
    return _.omit(this, ['password']);
  },

  beforeCreate: (user, cb) => {
    bcrypt.genSalt(10, function(err, salt) {
      user.password = bcrypt.hashSync(user.password, salt);
      cb();
    });
  },

};
