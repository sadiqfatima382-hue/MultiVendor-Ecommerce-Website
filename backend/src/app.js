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
// Routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Multi Vendor Ecommerce API"
    });
});

export default app;