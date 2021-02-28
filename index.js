const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    isHome: true
  });
});

app.get('/courses', (req, res) => {
  res.render('courses', {
    title: 'Courses',
    isCourses: true
  });
});

app.get('/add-course', (req, res) => {
  res.render('addCourse', {
    title: 'Add course',
    isAddCourse: true
  });
});

const PORT = process.argv.PORT | 3000;

app.listen(PORT, () => {
  console.log(`Server is runnig ${PORT}`);
});