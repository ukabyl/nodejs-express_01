const {model, Schema} = require('mongoose');

const userSchema = Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        }
      }
    ],
    price: Number
  }
});

module.exports = model('User', userSchema);