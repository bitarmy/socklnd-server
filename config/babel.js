/**
 * Blueprint API Configuration
 * (sails.config.babel)
 */

module.exports.babel = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "10"
        }
      }
    ],
  ]
};
