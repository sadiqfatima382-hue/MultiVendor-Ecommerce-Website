import {  createHomePage,  findHomePageById,  findHomePageBySlug,  findHomePageByName,  findHomePages,  countHomePages,  updateHomePage,  deleteHomePage,} from "../repositories/homePage.repository.js";
import {  createHomePageComponent,  findHomePageComponentById,  findHomePageComponents,  findComponentTypeById,  updateHomePageComponent,  deleteHomePageComponent,} from "../repositories/homePageComponent.repository.js";
import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

// CREATE HOME PAGE

export async function createHomePageService(data) {
  const {
    name,
    title,
    description,
    isActive = true,
    components = [],
  } = data;

  // Check duplicate name
  const existingName =
    await findHomePageByName(name);

  if (existingName) {
    throw new Error(
      "Home page with this name already exists."
    );
  }

  // Generate slug
  const slug = generateSlug(name);

  // Check duplicate slug
  const existingSlug =
    await findHomePageBySlug(slug);

  if (existingSlug) {
    throw new Error(
      "Home page with this slug already exists."
    );
  }

  // Validate all component types first
  for (const component of components) {
    const componentType =
      await findComponentTypeById(
        component.componentTypeId
      );

    if (!componentType) {
      throw new Error(
        `Component type ${component.componentTypeId} not found.`
      );
    }

    if (!componentType.isActive) {
      throw new Error(
        `Component type "${componentType.name}" is inactive.`
      );
    }
  }

  // Prevent duplicate sort orders
  const sortOrders = components.map(
    (component) => component.sortOrder
  );

  if (
    new Set(sortOrders).size !==
    sortOrders.length
  ) {
    throw new Error(
      "Duplicate component sortOrder values are not allowed."
    );
  }

  return createHomePage({
    name,
    slug,
    title,
    description,
    isActive,

    components: {
      create: components.map(
        (component, index) => ({
          componentTypeId:
            component.componentTypeId,

          title: component.title,

          content:
            component.content ?? null,

          sortOrder:
            component.sortOrder ?? index,

          isActive:
            component.isActive ?? true,
        })
      ),
    },
  });
}

// GET HOME PAGES

export async function getHomePagesService({
  page = 1,
  limit = 10,
  search,
  isActive,
}) {
  const { skip, take } =
    getPagination(page, limit);

  const where = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (isActive !== undefined) {
    where.isActive =
      isActive === true ||
      isActive === "true";
  }

  const [
    homePages,
    total,
  ] = await Promise.all([
    findHomePages({
      skip,
      take,
      where,
      orderBy: {
        createdAt: "desc",
      },
    }),

    countHomePages(where),
  ]);

  return {
    homePages,

    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages:
        Math.ceil(
          total / Number(limit)
        ),
    },
  };
}

// GET HOME PAGE BY ID

export async function getHomePageByIdService(
  id
) {
  const homePage =
    await findHomePageById(id);

  if (!homePage) {
    throw new Error(
      "Home page not found."
    );
  }

  return homePage;
}

// GET HOME PAGE COMPONENTS

export async function getHomePageComponentsService(
  homePageId
) {
  const homePage =
    await findHomePageById(homePageId);

  if (!homePage) {
    throw new Error(
      "Home page not found."
    );
  }

  return findHomePageComponents(
    homePageId
  );
}

// UPDATE HOME PAGE

export async function updateHomePageService(
  id,
  data
) {
  const homePage =
    await findHomePageById(id);

  if (!homePage) {
    throw new Error(
      "Home page not found."
    );
  }

  const updateData = {};

  // Name
  
  if (data.name !== undefined) {
    const existingName =
      await findHomePageByName(
        data.name
      );

    if (
      existingName &&
      existingName.id !== id
    ) {
      throw new Error(
        "Home page with this name already exists."
      );
    }

    const newSlug =
      generateSlug(data.name);

    const existingSlug =
      await findHomePageBySlug(
        newSlug
      );

    if (
      existingSlug &&
      existingSlug.id !== id
    ) {
      throw new Error(
        "Home page with this slug already exists."
      );
    }

    updateData.name =
      data.name;

    updateData.slug =
      newSlug;
  }

  // Other fields
  if (data.title !== undefined) {
    updateData.title =
      data.title;
  }

  if (
    data.description !== undefined
  ) {
    updateData.description =
      data.description;
  }

  if (
    data.isActive !== undefined
  ) {
    updateData.isActive =
      data.isActive;
  }

  return updateHomePage(
    id,
    updateData
  );
}

// ADD COMPONENT TO HOME PAGE

export async function addHomePageComponentService(
  homePageId,
  data
) {
  const homePage =
    await findHomePageById(
      homePageId
    );

  if (!homePage) {
    throw new Error(
      "Home page not found."
    );
  }

  // Check component type
  const componentType =
    await findComponentTypeById(
      data.componentTypeId
    );

  if (!componentType) {
    throw new Error(
      "Component type not found."
    );
  }

  if (!componentType.isActive) {
    throw new Error(
      "Component type is inactive."
    );
  }

  // Check sort order
  const existing =
    await findHomePageComponents(
      homePageId
    );

  const sortOrder =
    data.sortOrder ??
    existing.length;

  if (
    existing.some(
      (component) =>
        component.sortOrder ===
        sortOrder
    )
  ) {
    throw new Error(
      "This sortOrder is already being used by another component."
    );
  }

  return createHomePageComponent({
    homePageId,
    componentTypeId:
      data.componentTypeId,

    title:
      data.title,

    content:
      data.content ?? null,

    sortOrder,

    isActive:
      data.isActive ?? true,
  });
}

// UPDATE HOME PAGE COMPONENT
export async function updateHomePageComponentService(
  id,
  data
) {
  const component =
    await findHomePageComponentById(
      id
    );

  if (!component) {
    throw new Error(
      "Home page component not found."
    );
  }

  const updateData = {};

   // Component Type
   if (
    data.componentTypeId !==
    undefined
  ) {
    const componentType =
      await findComponentTypeById(
        data.componentTypeId
      );

    if (!componentType) {
      throw new Error(
        "Component type not found."
      );
    }

    if (!componentType.isActive) {
      throw new Error(
        "Component type is inactive."
      );
    }

    updateData.componentTypeId =
      data.componentTypeId;
  }

  // Sort Order
  if (
    data.sortOrder !== undefined
  ) {
    const components =
      await findHomePageComponents(
        component.homePageId
      );

    const duplicate =
      components.find(
        (item) =>
          item.id !== id &&
          item.sortOrder ===
            data.sortOrder
      );

    if (duplicate) {
      throw new Error(
        "This sortOrder is already being used by another component."
      );
    }

    updateData.sortOrder =
      data.sortOrder;
  }

    // Other fields
    if (data.title !== undefined) {
    updateData.title =
      data.title;
  }

  if (
    data.content !== undefined
  ) {
    updateData.content =
      data.content;
  }

  if (
    data.isActive !== undefined
  ) {
    updateData.isActive =
      data.isActive;
  }

  return updateHomePageComponent(
    id,
    updateData
  );
}

// DELETE HOME PAGE COMPONENT
export async function deleteHomePageComponentService(
  id
) {
  const component =
    await findHomePageComponentById(
      id
    );

  if (!component) {
    throw new Error(
      "Home page component not found."
    );
  }

  return deleteHomePageComponent(
    id
  );
}

// DELETE HOME PAGE
export async function deleteHomePageService(
  id
) {
  const homePage =
    await findHomePageById(id);

  if (!homePage) {
    throw new Error(
      "Home page not found."
    );
  }

  return deleteHomePage(id);
}