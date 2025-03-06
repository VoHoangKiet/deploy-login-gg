const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path');
require("dotenv").config();

const app = express();

passport.use(new GoogleStrategy({
  clientID: process.env.YOUR_GOOGLE_CLIENT_ID,
  clientSecret: process.env.YOUR_GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Cấu hình session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(`
        <html>
          <head><title>Login with Google</title></head>
          <body>
            <h1>Welcome, ${req.user.displayName}</h1>
            <a href="/logout"><button>Logout</button></a>
          </body>
        </html>
      `);
    } else {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});