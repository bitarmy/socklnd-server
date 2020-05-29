module.exports = {

  friendlyName: 'Create temporary api key',

  description: 'Creates a temporary key that expires in max 60 min and has payment subscription priviledge only.',

  // inputs: {
  //   // nodeId: {
  //   //   description: 'The ID of the node to connect.',
  //   //   // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
  //   //   // if the `userId` parameter is not a number.
  //   //   type: 'number',
  //   //   // By making the `userId` parameter required, Sails will automatically respond with
  //   //   // `res.badRequest` if it's left out.
  //   //   required: true
  //   // }
  // },

  // exits: {
  //    notUser: {
  //      statusCode: 403,
  //      description: 'Only users can create temp api keys.',
  //    }
  // },

  fn: async function (data) {
    const apiKey = this.req.apiKey;
    if (apiKey.category !== 'user') {
      //throw 'notUser';
      this.res.send(403, 'Only users can create temp api keys.')
    }
    data.owner = apiKey;
    data.category = 'invited';
    return await ApiKey.create(data).fetch();
  }
};
