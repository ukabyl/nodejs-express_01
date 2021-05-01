const {Router} = require('express');
const authMiddleware = require('../middleware/auth');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('userId', 'email name').select('title price img');

  res.render('courses', {
    title: 'Courses',
    isCourses: true,
    courses
  });
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Course - ${course ? course.title : ''}`,
    course
  });
});

router.get('/:id/edit', authMiddleware, async (req, res) => {
  if (req.query.allow) {
    const course = await Course.findById(req.params.id);

    res.render('editCourse', {
      title: `Edit course - ${course ? course.title : ''}`,
      course
    });

  } else res.redirect('/courses');
});

router.post('/edit', authMiddleware, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  await Course.findByIdAndUpdate(id, req.body);
  res.redirect('/courses');
});

router.post('/delete', authMiddleware, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id
    });
    res.redirect('/courses');
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;