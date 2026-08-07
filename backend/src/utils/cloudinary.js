// import cloudinary from "../config/cloudinary.js";
// import streamifier from "streamifier";

// export function uploadImageToCloudinary(
//   buffer,
//   folder = "general"
// ) {
//   return new Promise((resolve, reject) => {
//     const stream =
//       cloudinary.uploader.upload_stream(
//         {
//           folder,
//         },
//         (error, result) => {
//           if (error) {
//             return reject(error);
//           }

//           resolve({
//             url: result.secure_url,
//             publicId: result.public_id,
//           });
//         }
//       );

//     streamifier
//       .createReadStream(buffer)
//       .pipe(stream);
//   });
// }

// export async function deleteImageFromCloudinary(
//   publicId
// ) {
//   if (!publicId) return;

//   return cloudinary.uploader.destroy(
//     publicId
//   );
// }

// export async function replaceImage(
//   buffer,
//   oldPublicId,
//   folder = "general"
// ) {
//   if (oldPublicId) {
//     await deleteImage(oldPublicId);
//   }

//   return uploadImage(
//     buffer,
//     folder
//   );
// }

import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export function uploadImageToCloudinary(
  buffer,
  folder = "products"
) {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    streamifier
      .createReadStream(buffer)
      .pipe(stream);
  });
}

export async function deleteImageFromCloudinary(
  publicId
) {
  if (!publicId) return;

  return cloudinary.uploader.destroy(
    publicId
  );
}