const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
// cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "plashoes",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});
// multer middleware for uploading images to cloudinary
const upload = multer({ storage });

module.exports = upload;
