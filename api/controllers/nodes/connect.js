module.exports = {

   friendlyName: 'Connects to a Node',

   description: 'Connects to a Node if its not already connected.',

   inputs: {
     nodeId: {
       description: 'The ID of the node to connect.',
       // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
       // if the `userId` parameter is not a number.
       type: 'number',
       // By making the `userId` parameter required, Sails will automatically respond with
       // `res.badRequest` if it's left out.
       required: true
     }
   },

   exits: {
      success: {
        description: 'Successfully connected.',
      },
      notFound: {
        description: 'No node was found with that ID.',
        responseType: 'notFound'
      },
   },

   fn: async function ({nodeId}) {
      const node = await Node.findOne({ id: nodeId });

      // If no user was found, respond "notFound" (like calling `res.notFound()`)
      if (!node) { throw 'notFound'; }

      let res;
      try {
        res = await Node.connect(node);
      } catch (e) {
        res = {
          sucess: false,
          error: e
        }
      }
      return {
        node: node,
        connection: res
      };
   }
};
