import express from "express";
import {  authenticate,} from "../middlewares/auth.middleware.js";
import {  authorize,} from "../middlewares/authorize.middleware.js";
import {  validate,} from "../middlewares/validate.middleware.js";
import {  createContactSetting,  getContactSettings,  getActiveContactSetting,  getContactSettingById,  updateContactSetting,  deleteContactSetting,} from "../controllers/contactSetting.controller.js";
import {  createContactSettingSchema,  updateContactSettingSchema,  contactSettingIdSchema,  contactSettingQuerySchema,} from "../validators/website/contactSetting.validation.js";

const router = express.Router();


// =====================================================
// PUBLIC
// =====================================================

router.get(
  "/active",
  getActiveContactSetting
);


// =====================================================
// ADMIN
// =====================================================

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(createContactSettingSchema),
  createContactSetting
);


router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(contactSettingQuerySchema),
  getContactSettings
);


router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(contactSettingIdSchema),
  getContactSettingById
);


router.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(updateContactSettingSchema),
  updateContactSetting
);


router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  validate(contactSettingIdSchema),
  deleteContactSetting
);


export default router;