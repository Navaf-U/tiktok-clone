import cloudinary from "../config/CloudinaryConfig.js";
import CustomError from "../util/CustomError.js";
import { PassThrough } from "stream";
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new CustomError("Please upload a file", 400));
    }
    const buffer = req.file.buffer;
    const resourceType = req.file.mimetype.startsWith("image")
      ? "image"
      : "video";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "tiktok_clone",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error.message);
          return next(new CustomError(error.message, 400));
        }
        req.uploadedFile = result;
        next();
      }
    );
    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  } catch (error) {
    console.error("Middleware Error:", error.message);
    next(new CustomError("An unexpected error occurred", 500));
  }
};

export { uploadToCloudinary };
