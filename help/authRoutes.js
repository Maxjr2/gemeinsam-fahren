const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('./models');

const router = express.Router();

// Passport configuration (same as before)
// ...

// Authentication routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { fname, lname, email, phone, password, rights } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fname,
      lname,
      email,
      phone,
      password: hashedPassword,
      rights
    });
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.redirect('/register');
      }
      return res.redirect('/dashboard');
    });
  } catch (error) {
    console.error(error);
    res.redirect('/register');
  }
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;