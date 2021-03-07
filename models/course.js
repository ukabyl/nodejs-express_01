const {model, Schema} = require('mongoose');

const course = Schema({
  title: { type: String, require: true},
  price: { type: String, require: true},
  img: { type: String, require: false},
});

module.exports = model('Course', course);