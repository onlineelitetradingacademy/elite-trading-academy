const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Generic storage factory
const createStorage = (folder, resourceType = 'auto') => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `elite-trading-academy/${folder}`,
    resource_type: resourceType,
    allowed_formats: resourceType === 'video'
      ? ['mp4', 'mov', 'avi', 'mkv']
      : resourceType === 'raw'
      ? ['pdf', 'doc', 'docx', 'xls', 'xlsx']
      : ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
  }
});

const uploadImage   = multer({ storage: createStorage('images') });
const uploadVideo   = multer({ storage: createStorage('videos', 'video') });
const uploadDoc     = multer({ storage: createStorage('documents', 'raw') });
const uploadAny     = multer({ storage: createStorage('uploads') });

// Delete from cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { cloudinary, uploadImage, uploadVideo, uploadDoc, uploadAny, deleteFromCloudinary };
