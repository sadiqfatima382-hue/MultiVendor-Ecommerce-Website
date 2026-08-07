// import multer from "multer";

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed."));
//   }
//   console.log("File:", file.originalname);
// console.log("Mimetype:", file.mimetype);
// };


// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// export default upload;

import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("========== MULTER FILE ==========");
  console.log("fieldname:", file.fieldname);
  console.log("originalname:", file.originalname);
  console.log("mimetype:", file.mimetype);
  console.log("=================================");

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;