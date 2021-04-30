const { Router } = require('express');
const router = Router();

router.get('/login', (req, res) => {
  res.render('auth', {
    title: 'Login',
    isLogin: true,
  })
});

router.post('/login', (req, res) => {
  const { email, password } = req.body
  console.log(email, password, 'LOGIN');
  res.status(200);
});

router.post('/register', (req, res) => {
  const { email, password } = req.body
  console.log(email, password, 'REGISTER');
  res.status(200);
});

module.exports = router;