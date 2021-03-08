const {Router} = require('express');
const Course = require('../models/course');

const router = Router();

router.get('/', (req, res) => {
  res.render('addCourse', {
    title: 'Add course',
    isAddCourse: true
  });
});

router.post('/', (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      userId: req.user._id
    });
    course.save();
    res.redirect('/courses');
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;