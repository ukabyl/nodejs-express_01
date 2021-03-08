const { Router } = require('express');
const Course = require('../models/course');

const router = Router();

router.get('/', async (req, res) => {
  res.json({test: true});
});

router.post('/', async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);

  res.redirect('/cart');
});

router.delete('/:id/delete', async (req, res) => {
  const cart = await Cart.delete(req.params.id);
  res.json(cart);
});

module.exports = router;