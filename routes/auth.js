const { Router } = require('express');
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

router.post('/login', (req, res) => {
  const { email, password } = req.body

  req.session.isAuthenticated = true;
  res.redirect('/');
});

router.post('/register', (req, res) => {
  const { email, password } = req.body
  console.log(email, password, 'REGISTER');
  res.status(200);
});

module.exports = router;