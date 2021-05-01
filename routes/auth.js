const { Router } = require('express');
const user = require('../models/user');
const User = require('../models/user');
const router = Router();

router.get('/login', (req, res) => {
  res.render('auth', {
    title: 'Login',
    isLogin: true,
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
      const isSame = password === candidate.password;

      if (isSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
      
        req.session.save(err => {
          if (err) throw err
          res.redirect('/');
        })
      } else {
        res.redirect('/auth/login')
      }
    } else {
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
      res.redirect('/auth/login#register');
    } else {
      const user = new User({
        email, name, password, cart: { items: [] }
      });

      await user.save();
      res.redirect('/auth/login');
    }
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;