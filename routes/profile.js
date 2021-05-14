const { Router } = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true,
    user: req.user
  })
});

router.post('/', async (req, res) => {
  try {
    const toChange = {
      name: req.body.name
    }

    const user = await User.findById(req.user._id);

    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }
    
    Object.assign(user, toChange);
    await user.save();
    res.redirect('/profile');

  } catch(e) {
    console.log(e);
  }
})

module.exports = router;
