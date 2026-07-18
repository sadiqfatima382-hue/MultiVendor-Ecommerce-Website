import {  createProductImageService,  getProductImagesService,  setPrimaryImageService,  deleteProductImageService,} from "../services/productImage.service.js";
export async function createProductImage(req, res, next) {
  try {
    const image = await createProductImageService(
      req.file,
      req.validatedData
    );

    return res.status(201).json({
      success: true,
      message: "Product image uploaded successfully.",
      data: image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
     
    });
  }
}

export async function getProductImages(req, res, next) {
  try {
    const images = await getProductImagesService(req.query);

    return res.status(200).json({
      success: true,
      message: "Product images fetched successfully.",
      data: images,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
}

export async function setPrimaryImage(req, res, next) {
  try {
    const image = await setPrimaryImageService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Primary image updated successfully.",
      data: image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
}

export async function deleteProductImage(req, res, next) {
  try {
    await deleteProductImageService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}