module.exports = async function (req, res, done) {
  //return done('Error mi viejooo');
  // passport.authenticate('bearer', {session: false}, function(err, user, info) {
  //   if (err) return done(err);
  //   if (user) return done();
  //
  //   return res.send(403, {message: "You are not permitted to perform this action."});
  // })(req, res);
  //
  //
  //res.status(403).send("You are not permitted to perform this action.");
  //done('Erroreeee');
  const cookie = req.isSocket ? req.socket.handshake.headers.authorization : req.headers.authorization;
  // console.dir(req.headers);
  const accessToken = sails.services.auth.parseTokenFromCookie(cookie);
  if (accessToken === null) {
    //res.error()
    return res.send(401, 'No API Token provided');
  }
  try {
    let api = await sails.services.auth.loginWithToken(accessToken);
    if (api !== null) {
      req.apiKey = api;
      done();
    } else {
      return res.send(403, 'Invalid API Key or already expired');
    }
  } catch (e) {
    return done(e);
  }
};
