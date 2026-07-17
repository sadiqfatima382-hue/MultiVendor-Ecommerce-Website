import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export function uploadImageToCloudinary(buffer, folder = "products") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function deleteImageFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}