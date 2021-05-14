const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true
  })
});

module.exports = router;
