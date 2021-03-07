const {model, Schema} = require('mongoose');

const courseSchema = Schema({
  title: { type: String, required: true},
  price: { type: String, required: true},
  img: { type: String, required: false},
});

module.exports = model('Course', courseSchema);