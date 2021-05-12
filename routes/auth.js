const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult} = require('express-validator/check');
const User = require('../models/user');
const router = Router();
const nodemailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');
const keys = require('../keys');

const registerMail = require('../mails/registration');
const resetMail = require('../mails/reset');

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

router.get('/reset', (req, res) => {
  res.render('reset', {
    title: 'Forget password',
    error: req.flash('error'),
    success: req.flash('success'),
  })
})

router.get('/password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    });

    if (!user) {
      res.redirect('/auth/login');
    } else {
      res.render('password', {
        title: 'Change password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      });
    }

  } catch(e) {
    console.log(e);
  }
})

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

router.post('/register', body('email').isEmail(), async (req, res) => {
  try {
    const { email, password, name, confirm } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg);
      res.status(422).redirect('/auth/login#register');
    }

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

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(10, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Somethis went wrong. Please check it out later!');
        return res.redirect('/auth/reset');
      }
      const token = buffer.toString('hex');
  
      try {
        const candidate = await User.findOne({
          email: req.body.email,
        });
  
        if (candidate) {
          candidate.resetToken = token;
          candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
          await candidate.save();
          await mailer.sendMail(resetMail(candidate.email, token));
          req.flash('success', 'We send your email the further instructions to follow. Please check your email!');
          res.redirect('/auth/reset');
        } else {
          req.flash('error', 'Ooops... User is not found!');
          res.redirect('/auth/reset');
        }
      } catch(e) {
        console.log(e);
      }
    });
  } catch(e) {
    console.log(e);
  }
})

router.post('/change-password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    });

    if (!user) {
      res.redirect('/auth/login');
    } else {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;

      await user.save();

      res.redirect('/auth/login');
    }

  } catch(e) {
    console.log(e);
  }
});

module.exports = router;