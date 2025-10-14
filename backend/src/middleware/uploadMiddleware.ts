import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// Upload dizinlerini oluştur
const uploadDirs = {
  profiles: 'uploads/profiles',
  posts: 'uploads/posts',
  stories: 'uploads/stories',
  messages: 'uploads/messages',
  temp: 'uploads/temp',
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadDirs.temp;
    
    // Determine upload path based on field name
    switch (file.fieldname) {
      case 'profilePicture':
      case 'coverPhoto':
        uploadPath = uploadDirs.profiles;
        break;
      case 'postMedia':
        uploadPath = uploadDirs.posts;
        break;
      case 'storyMedia':
        uploadPath = uploadDirs.stories;
        break;
      case 'messageMedia':
        uploadPath = uploadDirs.messages;
        break;
      default:
        uploadPath = uploadDirs.temp;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10, // Maximum 10 files
  },
});

// Image processing utilities
export class ImageProcessor {
  static async processProfilePicture(filePath: string): Promise<string> {
    const processedPath = filePath.replace(path.extname(filePath), '_processed.jpg');
    
    await sharp(filePath)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toFile(processedPath);
    
    // Remove original file
    fs.unlinkSync(filePath);
    
    return processedPath;
  }

  static async processPostImage(filePath: string): Promise<string> {
    const processedPath = filePath.replace(path.extname(filePath), '_processed.jpg');
    
    await sharp(filePath)
      .resize(1080, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(processedPath);
    
    // Remove original file
    fs.unlinkSync(filePath);
    
    return processedPath;
  }

  static async createThumbnail(filePath: string): Promise<string> {
    const thumbnailPath = filePath.replace(path.extname(filePath), '_thumb.jpg');
    
    await sharp(filePath)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toFile(thumbnailPath);
    
    return thumbnailPath;
  }
}

// File management utilities
export class FileManager {
  static getFileUrl(filePath: string): string {
    // Convert local file path to URL
    return filePath.replace('uploads/', '/uploads/');
  }

  static deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  static async validateFile(file: Express.Multer.File): Promise<boolean> {
    try {
      // Check if file exists
      if (!fs.existsSync(file.path)) {
        return false;
      }

      // For images, validate with sharp
      if (file.mimetype.startsWith('image/')) {
        const metadata = await sharp(file.path).metadata();
        return metadata.width !== undefined && metadata.height !== undefined;
      }

      return true;
    } catch (error) {
      console.error('File validation error:', error);
      return false;
    }
  }
}

// Upload middleware variants
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: Array<{ name: string; maxCount?: number }>) => upload.fields(fields);

// Profile upload
export const uploadProfile = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]);

// Post upload (multiple media files)
export const uploadPost = upload.array('postMedia', 10);

// Story upload (single media file)
export const uploadStory = upload.single('storyMedia');

// Message upload (single media file)
export const uploadMessage = upload.single('messageMedia');

// Error handling middleware
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 50MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum is 10 files.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name in file upload.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + error.message
        });
    }
  }

  if (error.message === 'Invalid file type. Only images and videos are allowed.') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

export default {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadProfile,
  uploadPost,
  uploadStory,
  uploadMessage,
  handleUploadError,
  ImageProcessor,
  FileManager,
};