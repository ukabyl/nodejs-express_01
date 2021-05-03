const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = Router();
const nodemailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');
const keys = require('../keys');

const registerMail = require('../mails/registration');

let mailer = nodemailer.createTransport(transport({
  auth: {
    api_key: keys.SENDGRID_API_KEY
  }
}));

router.get('/login', (req, res) => {
  res.render('auth', {
    title: 'Login',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
  })
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });
    
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
      
        req.session.save(err => {
          if (err) throw err
          res.redirect('/');
        })
      } else {
        req.flash('loginError', 'Password does not match');
        res.redirect('/auth/login')
      }
    } else {
      req.flash('loginError', 'User is not found.');
      res.redirect('/auth/login')
    }
  } catch(e) {
    console.log(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, confirm } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('registerError', 'User is already exists.');
      res.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email, name, password: hashPassword, cart: { items: [] }
      });

      await user.save();
      res.redirect('/auth/login');
      await mailer.sendMail(registerMail(email));
    }
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;