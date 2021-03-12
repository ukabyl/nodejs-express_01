const { Router } = require('express');
const Course = require('../models/course');

const router = Router();

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.courseId._doc,
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
    isCourses: true,
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
  const cart = await Cart.delete(req.params.id);
  res.json(cart);
});

module.exports = router;