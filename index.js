require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const varialbesMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const csrf = require('csurf');
const flash = require('connect-flash');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addCourseRoutes = require('./routes/addCourse');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const notFoundPage = require('./middleware/notFoundPage');
const keys = require('./keys');

const store = MongoStore({
  collection: 'sessions',
  uri: keys.MONGO_URI
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
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(csrf());
app.use(flash());
app.use(varialbesMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/addCourse', addCourseRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

app.use(notFoundPage);

const PORT = process.argv.PORT | 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

    app.listen(PORT, () => {
      console.log(`Server is runnig ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  }
}

start();