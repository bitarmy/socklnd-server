module.exports = {

   friendlyName: 'Welcome user',

   description: 'Look up the specified user and welcome them, or redirect to a signup page if no user was found.',

   inputs: {
      
   },

   exits: {
      success: {
        responseType: 'view',
        viewTemplatePath: 'pages/welcome'
      },
      notFound: {
        description: 'No user with the specified ID was found in the database.',
        responseType: 'notFound'
      }
   },

   fn: async function ({userId}) {
     return {'yeah': 'bitchaaa!!'};
      // Look up the user whose ID was specified in the request.
      // Note that we don't have to validate that `userId` is a number;
      // the machine runner does this for us and returns `badRequest`
      // if validation fails.
      var user = await User.findOne({ id: userId });

      // If no user was found, respond "notFound" (like calling `res.notFound()`)
      if (!user) { throw 'notFound'; }

      // Display a personalized welcome view.
      return {
        name: user.name
      };
   }
};
