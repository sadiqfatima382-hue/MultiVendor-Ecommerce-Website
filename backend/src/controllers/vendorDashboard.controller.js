import { getDashboardStatsService, getVendorProductsService, getVendorProductByIdService, getLowStockProductsService, getOutOfStockProductsService, submitProductService, } from "../services/vendorDashboard.service.js";

export async function getDashboardStats(req, res, next) {
    try {
        const stats = await getDashboardStatsService(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully.",
            data: stats,
        })
    } catch (error) {
            return res.status(500).json({
            success: false,
            message: error.message
    });
}
}

export async function getVendorProducts(req, res, next) {
    try {
        const products =await getVendorProductsService(req.user.id, req.query)

    return res.status(200).json({
      success: true,
      message: "Vendor products fetched successfully.",
      data: products,
    });
        
    } catch (error) {
        
    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
    }
    
}

export async function getVendorProduct(req, res, next) {
  try {
    const product = await getVendorProductByIdService(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message
  });
}
}

export async function getLowStockProducts(req, res, next) {
  try {
    const products = await getLowStockProductsService(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Low stock products fetched successfully.",
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOutOfStockProducts(req, res, next) {
  try {
    const products = await getOutOfStockProductsService(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Out of stock products fetched successfully.",
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitProduct(req, res, next) {
  try {
    const product = await submitProductService(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Product submitted successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
}