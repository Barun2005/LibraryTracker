const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter allowed file types (MIME and extension)
const fileFilter = function (req, file, cb) {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const allowedExts = ['.jpeg', '.jpg', '.png', '.pdf'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (allowedMimes.includes(mime) && allowedExts.includes(ext)) {
    return cb(null, true);
  }

  cb(new Error('Only JPEG, JPG, PNG, and PDF files are allowed!'));
};

// Multer config
const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
  fileFilter: fileFilter
});

module.exports = upload;
