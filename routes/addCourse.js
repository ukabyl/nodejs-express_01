const {Router} = require('express');
const authMiddleware = require('../middleware/auth');
const Course = require('../models/course');
const { validationResult } = require('express-validator');
const { courseValidations } = require('..//utils/validators');

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('addCourse', {
    title: 'Add course',
    isAddCourse: true
  });
});

router.post('/', authMiddleware, courseValidations, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('addCourse', {
      title: 'Add course',
      isAddCourse: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      }
    });
  }
  
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