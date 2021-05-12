const { body } = require('express-validator/check');

exports.registerValidations = [
  body('email').isEmail().withMessage('Email has an incorrect value'),
  body('name').isLength({min: 3}).withMessage('Name should have minimum 3 characters'),
  body('password', 'Password should have minimum 6 characters').isLength({ min: 6, max: 56 }).isAlphanumeric().withMessage('Password should have numbers and letters'),
  body('confirm').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Password and confirm don\'t match')
    }
    return true
  }),
]