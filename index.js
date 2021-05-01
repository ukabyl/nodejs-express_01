require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const varialbesMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/addCourse');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const MONGO_URI  = `mongodb+srv://ukabyl:${process.env.PASSWORD}@cluster0.xpxu8.mongodb.net/db`;

const store = MongoStore({
  collection: 'sessions',
  uri: MONGO_URI
});

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
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(varialbesMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/addCourse', addCourseRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.argv.PORT | 3000;

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

    app.listen(PORT, () => {
      console.log(`Server is runnig ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  }
}

start();