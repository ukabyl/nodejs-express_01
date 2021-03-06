const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/addCourse');
const cartRoutes = require('./routes/cart');

const app = express();
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/addCourse', addCourseRoutes);
app.use('/cart', cartRoutes);

const PORT = process.argv.PORT | 3000;

app.listen(PORT, () => {
  console.log(`Server is runnig ${PORT}`);
});