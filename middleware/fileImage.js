const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
})

const allowedType = ['image/png','image/jpg','image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

module.exports = multer({
  storage, fileFilter
});