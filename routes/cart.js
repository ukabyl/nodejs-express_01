const { Router } = require('express');
const Course = require('../models/course');

const router = Router();

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count
  }))
}

function computeCartCoursesPirce(courses) {
  return courses.reduce((total, course) => {
    return total += course.price * course.count;
  }, 0)
}

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);

  res.render('cart', {
    title: 'Courses',
    isCart: true,
    courses: courses,
    price: computeCartCoursesPirce(courses)
  });
});

router.post('/', async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);

  res.redirect('/cart');
});

router.delete('/:id/delete', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCartItems(user.cart);

  const cart = {
    courses,
    price: computeCartCoursesPirce(courses)
  };

  res.json(cart);
});

module.exports = router;