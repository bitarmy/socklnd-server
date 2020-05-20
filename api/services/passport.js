const passport = require('passport'),
      BearerStrategy = require('passport-http-bearer').Strategy;

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function(accessToken, done) {
    sails.log.info('----------------- CARGADO -----------------');
    sails.log.info('Trataron de entrar mi viejoooo!!!');
    console.dir(accessToken);
    done(null, {user: '234234234', datita: 'adadsdas'});
    // Tokens.findOne({token: accessToken}, function(err, token) {
    //   if (err) return done(err);
    //   if (!token) return done(null, false);
    //   if (token.userId != null) {
    //     Users.find(token.userId, function(err, user) {
    //       if (err) return done(err);
    //       if (!user) return done(null, false);
    //       // to keep this example simple, restricted scopes are not implemented,
    //       // and this is just for illustrative purposes
    //       var info = { scope: '*' }
    //       done(null, user, info);
    //     });
    //   }
    //   else {
    //     //The request came from a client only since userId is null
    //     //therefore the client is passed back instead of a user
    //     Clients.find({clientId: token.clientId}, function(err, client) {
    //       if (err) return done(err);
    //       if (!client) return done(null, false);
    //       // to keep this example simple, restricted scopes are not implemented,
    //       // and this is just for illustrative purposes
    //       var info = { scope: '*' }
    //       done(null, client, info);
    //     });
    //   }
    // });
  }
));
