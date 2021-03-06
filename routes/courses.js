const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.getAll();

  res.render('courses', {
    title: 'Courses',
    isCourses: true,
    courses
  });
});

router.get('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Course - ${course ? course.title : ''}`,
    course
  });
});

router.get('/:id/edit', async (req, res) => {
  if (req.query.allow) {
    const course = await Course.getById(req.params.id);

    res.render('editCourse', {
      title: `Edit course - ${course ? course.title : ''}`,
      course
    });

  } else res.redirect('/courses');
});

router.post('/edit', async (req, res) => {
  await Course.update(req.body);
  res.redirect('/courses');
});

module.exports = router;