const { Router } = require('express');
const Course = require('../models/course');
const Cart = require('../models/cart');

const router = Router();

router.get('/', async (req, res) => {
  const cart = await Cart.fetch();

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: cart.courses,
    price: cart.price
  })
});

router.post('/', async (req, res) => {
  const course = await Course.getById(req.body.id);
  await Cart.add(course);
  res.redirect('/cart');
});

router.delete('/:id/delete', (req, res) => {
  console.log(req.params.id);
});

module.exports = router;