import {
  createBlogPostService,
  getBlogPostsService,
  getBlogPostByIdService,
  getBlogPostBySlugService,
  updateBlogPostService,
  publishBlogPostService,
  unpublishBlogPostService,
  setFeaturedBlogPostService,
  deleteBlogPostService,
} from "../services/blogPost.service.js";


// =====================================================
// CREATE
// =====================================================

export async function createBlogPost(req, res) {
  try {
    const post =
      await createBlogPostService(
        req.validatedData.body,
        req.file
      );

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully.",
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET ALL
// =====================================================

export async function getBlogPosts(req, res) {
  try {
    const result =
      await getBlogPostsService(
        req.validatedData.query
      );

    return res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET BY ID
// =====================================================

export async function getBlogPostById(req, res) {
  try {
    const post =
      await getBlogPostByIdService(
        req.validatedData.params.id,
        false
      );

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET BY SLUG - PUBLIC
// =====================================================

export async function getBlogPostBySlug(req, res) {
  try {
    const post =
      await getBlogPostBySlugService(
        req.validatedData.params.slug,
        true
      );

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// UPDATE
// =====================================================

export async function updateBlogPost(req, res) {
  try {
    const post =
      await updateBlogPostService(
        req.validatedData.params.id,
        req.validatedData.body,
        req.file
      );

    return res.status(200).json({
      success: true,
      message: "Blog post updated successfully.",
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// PUBLISH
// =====================================================

export async function publishBlogPost(req, res) {
  try {
    const post =
      await publishBlogPostService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Blog post published successfully.",
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// UNPUBLISH
// =====================================================

export async function unpublishBlogPost(req, res) {
  try {
    const post =
      await unpublishBlogPostService(
        req.validatedData.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Blog post unpublished successfully.",
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// FEATURE / UNFEATURE
// =====================================================

export async function setFeaturedBlogPost(req, res) {
  try {
    const post =
      await setFeaturedBlogPostService(
        req.validatedData.params.id,
        req.validatedData.body.isFeatured
      );

    return res.status(200).json({
      success: true,
      message: req.validatedData.body.isFeatured
        ? "Blog post marked as featured."
        : "Blog post removed from featured.",
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// DELETE
// =====================================================

export async function deleteBlogPost(req, res) {
  try {
    await deleteBlogPostService(
      req.validatedData.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}