import {
  createHomePageService,
  getHomePagesService,
  getHomePageByIdService,
  updateHomePageService,
  deleteHomePageService,
  getHomePageComponentsService,
  addHomePageComponentService,
  updateHomePageComponentService,
  deleteHomePageComponentService,
} from "../services/homePage.service.js";


// =====================================================
// CREATE HOME PAGE
// =====================================================

export async function createHomePage(req, res) {
  try {
    const homePage =
      await createHomePageService(req.body);

    return res.status(201).json({
      success: true,
      message: "Home page created successfully.",
      data: homePage,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET HOME PAGES
// =====================================================

export async function getHomePages(req, res) {
  try {
    const result =
      await getHomePagesService({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        isActive: req.query.isActive,
      });

    return res.status(200).json({
      success: true,
      data: result.homePages,
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
// GET HOME PAGE BY ID
// =====================================================

export async function getHomePageById(req, res) {
  try {
    const homePage =
      await getHomePageByIdService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: homePage,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// UPDATE HOME PAGE
// =====================================================

export async function updateHomePage(req, res) {
  try {
    const homePage =
      await updateHomePageService(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Home page updated successfully.",
      data: homePage,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// DELETE HOME PAGE
// =====================================================

export async function deleteHomePage(req, res) {
  try {
    await deleteHomePageService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Home page deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// GET HOME PAGE COMPONENTS
// =====================================================

export async function getHomePageComponents(
  req,
  res
) {
  try {
    const components =
      await getHomePageComponentsService(
        req.params.homePageId
      );

    return res.status(200).json({
      success: true,
      data: components,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// ADD COMPONENT
// =====================================================

export async function addHomePageComponent(
  req,
  res
) {
  try {
    const component =
      await addHomePageComponentService(
        req.params.homePageId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Component added to home page successfully.",
      data: component,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// UPDATE COMPONENT
// =====================================================

export async function updateHomePageComponent(
  req,
  res
) {
  try {
    const component =
      await updateHomePageComponentService(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Home page component updated successfully.",
      data: component,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


// =====================================================
// DELETE COMPONENT
// =====================================================

export async function deleteHomePageComponent(
  req,
  res
) {
  try {
    await deleteHomePageComponentService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Home page component deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}