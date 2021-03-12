const {model, Schema} = require('mongoose');

const courseSchema = Schema({
  title: { type: String, required: true},
  price: { type: String, required: true},
  img: { type: String, required: false},
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

courseSchema.method('toClient', function() {
  const course = this.toObject();

  course.id = course._id;
  delete course._id

  return course;
})

module.exports = model('Course', courseSchema);