/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  //


  const node = await Node.findOne({ id: 1 });

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
  // console.log({
  //   node: node,
  //   connection: res
  // });

};
