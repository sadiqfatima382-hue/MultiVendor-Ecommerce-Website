import express from "express";
import { authenticate, } from "../middlewares/auth.middleware.js";
import { authorize, } from "../middlewares/authorize.middleware.js";
import { validate, } from "../middlewares/validate.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createBlogPost, getBlogPosts, getBlogPostById, getBlogPostBySlug, updateBlogPost, publishBlogPost, unpublishBlogPost, setFeaturedBlogPost, deleteBlogPost, } from "../controllers/blogPost.controller.js";
import { createBlogPostSchema, updateBlogPostSchema, blogPostIdSchema, blogPostSlugSchema, blogPostQuerySchema, featuredBlogPostSchema, } from "../validators/website/blogPost.validation.js";

const router = express.Router();


// =====================================================
// PUBLIC
// =====================================================

// Published blog listing
router.get(
    "/public",
    validate(blogPostQuerySchema),
    (req, res, next) => {
        req.validatedData.query.publicOnly = true;
        next();
    },
    getBlogPosts
);


// Public single post by slug
router.get(
    "/slug/:slug",
    validate(blogPostSlugSchema),
    getBlogPostBySlug
);


// =====================================================
// ADMIN
// =====================================================

// Create
router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("featuredImage"),
    validate(createBlogPostSchema),
    createBlogPost
);


// Get all
router.get(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(blogPostQuerySchema),
    getBlogPosts
);


// Get by ID
router.get(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(blogPostIdSchema),
    getBlogPostById
);


// Update
router.patch(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    upload.single("featuredImage"),
    validate(updateBlogPostSchema),
    updateBlogPost
);


// Publish
router.patch(
    "/:id/publish",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(blogPostIdSchema),
    publishBlogPost
);


// Unpublish
router.patch(
    "/:id/unpublish",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(blogPostIdSchema),
    unpublishBlogPost
);


// Featured / unfeatured
router.patch(
    "/:id/featured",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(featuredBlogPostSchema),
    setFeaturedBlogPost
);


// Delete
router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(blogPostIdSchema),
    deleteBlogPost
);


export default router;