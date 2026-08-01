import { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier, } from "../controllers/supplier.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createSupplierSchema, updateSupplierSchema, supplierIdSchema, } from "../validators/purchase/supplier.validation.js";

const router = Router();

router.use(authenticate, authorize("SUPER_ADMIN", "VENDOR"));

router.post("/", validate(createSupplierSchema), createSupplier);
router.get("/", getSuppliers);
router.get("/:id", validate(supplierIdSchema), getSupplierById);
router.put("/:id", validate(supplierIdSchema), validate(updateSupplierSchema), updateSupplier);
router.delete("/:id", validate(supplierIdSchema), deleteSupplier);

export default router;