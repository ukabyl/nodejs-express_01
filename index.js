const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

const PORT = process.argv.PORT | 3000;

app.listen(PORT, () => {
  console.log(`Server is runnig ${PORT}`);
});