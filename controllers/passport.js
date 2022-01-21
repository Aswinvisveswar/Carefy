// passport is what we will use for authentication
module.exports = function(app, mongoose, User) {
  const passport = require('passport');
  // a middleware which sets up sessions
  const session = require('express-session');
  //const MongoStore = require('connect-mongo');
  
  // this allows us to create an authentication system
  // with a username and password
  const LocalStrategy = require('passport-local');

  // we name our mongoose connection
  console.log("DB URI",process.env.MONGO_URI)
  //const db = mongoose.connect('mongodb+srv://Aswin:Aswin@carefy.l1vpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
//   mongoose.connect('mongodb+srv://Aswin:Aswin@carefy.l1vpq.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => app.listen(PORT, () => 
// console.log("Server up and running!")))
// .catch((error) => console.log(error.message)) 
  //const db = mongoose.connection;
//
  //// log an error if there's an error
  //db.on('error', console.error.bind(console, 'connection error:'));
//
  //// log a message to the terminal when database connection is "open"
  // db.once('open', function() {
  //   console.log('You are connected!');
  // });
//
  //// set session secret used to sign session ID cookie
  app.use(
   session({
     secret: 'french toast',
    //  store: MongoStore.create({
    //   mongoUrl:'mongodb+srv://Aswin:Aswin@carefy.l1vpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    //   touchAfter: 24 * 3600,
    //   autoRemove: 'disabled'
    // }),
     resave: false,
     saveUninitialized: true
   })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!(user.password === password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  return passport;
}