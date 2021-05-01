const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const Order = require('../models/order');
const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  const orders = await Order.find({
    'user.id': req.user._id
  });

  res.render('orders', {
    title: 'Orders',
    isOrders: true,
    orders: orders.map(o => {
      return {
        ...o._doc,
        price: o.courses.reduce((total, c) => {
          return total += c.count * c.course.price;
        }, 0)
      }
    })
  })
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseId').execPopulate();

    const courses = user.cart.items.map((c) => ({
      count: c.count,
      course: c.courseId._doc
    }));
  
 
  
    const order = new Order({
      courses,
      user: {
        name: user.name,
        id: user._id
      }
    });
    await order.save();
    await req.user.clearCart();
 
    res.redirect('/orders');
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;