const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config()

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/addCourse');
const cartRoutes = require('./routes/cart');

const app = express();
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
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

console.log(process.env.PASSWORD)

async function start() {
  try {
    const url = `mongodb+srv://ukabyl:${process.env.PASSWORD}@cluster0.xpxu8.mongodb.net/db`;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
  
    app.listen(PORT, () => {
      console.log(`Server is runnig ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  }
}

start();