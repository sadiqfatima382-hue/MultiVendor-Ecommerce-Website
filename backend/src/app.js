import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import productTypeRoutes from"./routes/productType.routes.js";
import productBaseRoutes from"./routes/productBase.routes.js";
import productBadgeRoutes from"./routes/productBadge.routes.js";
import productColorRoutes from "./routes/productColor.routes.js";
import productSizeRoutes from "./routes/productSize.routes.js";
import productWeightRoutes from "./routes/productWeight.routes.js";
import productRoutes from "./routes/product.routes.js";
import productVariantRoutes from "./routes/productVariant.routes.js";
import productImageRoutes from "./routes/productImage.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import vendorDashboardRoutes from "./routes/vendorDashboard.routes.js";
import vendorConfigRoutes from "./routes/vendorConfig.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import vendorOrderRoutes from "./routes/vendorOrder.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import qualityControlRoutes from "./routes/qualityControl.routes.js";
import abandonedCartRoutes from "./routes/abandonedCart.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import customerDashboardRoutes from "./routes/customerDashboard.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/product-types", productTypeRoutes);
app.use("/api/product-base", productBaseRoutes);
app.use("/api/product-badge", productBadgeRoutes);
app.use("/api/product-color", productColorRoutes);
app.use("/api/product-size", productSizeRoutes);
app.use("/api/product-weight", productWeightRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-variants", productVariantRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/vendor/dashboard", vendorDashboardRoutes);
app.use("/api/vendor/config", vendorConfigRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/address", addressRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes);
app.use("/api/vendor/orders", vendorOrderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/quality-control", qualityControlRoutes);
app.use("/api/abandoned-carts", abandonedCartRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/customer-dashboard", customerDashboardRoutes);
app.use("/api/suppliers", supplierRoutes);
// Routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Multi Vendor Ecommerce API"
    });
});

export default app;