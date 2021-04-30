require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const User = require('./models/user');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/addCourse');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

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

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('604bd547fef68676b090468c');
    req.user = user;
    next();
  } catch(e) {
    console.log(e);
  }
});

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/addCourse', addCourseRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.argv.PORT | 3000;

async function start() {
  try {
    const url = `mongodb+srv://ukabyl:${process.env.PASSWORD}@cluster0.xpxu8.mongodb.net/db`;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: 'ukabylbeko@mail.ru',
        name: 'Umirzak',
        cart: {items: []}
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is runnig ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  }
}

start();