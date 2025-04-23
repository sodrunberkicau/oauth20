const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');

// Setup session
app.use(session({
    secret: 'yourSuperSecretKey',  // Ganti dengan kunci yang Anda inginkan
    resave: false,
    saveUninitialized: true
}));


// Passport config
passport.use(new GoogleStrategy({
    clientID: "646479859989-fmnt7c9au3bi5kudate4mr13hm5sc9nq.apps.googleusercontent.com",  // Ganti dengan Client ID Anda
    clientSecret: "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",  // Ganti dengan Client Secret Anda
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');
    res.render('profile', { user: req.user });
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.listen(3001, () => console.log("Server berjalan di http://localhost:3001"));