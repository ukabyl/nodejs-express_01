const { Router } = require('express');
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
  const { email, password } = req.body;
  const user = await User.findById('604bd547fef68676b090468c');
  req.session.user = user;
  req.session.isAuthenticated = true;

  req.session.save(err => {
    if (err) throw err
    res.redirect('/');
  })
});

router.post('/register', (req, res) => {
  const { email, password } = req.body
  console.log(email, password, 'REGISTER');
  res.status(200);
});

module.exports = router;