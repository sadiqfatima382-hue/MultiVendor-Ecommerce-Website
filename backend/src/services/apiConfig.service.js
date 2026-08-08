import {  createApiConfig, findApiConfigById,  findApiConfigByName,  findApiConfigs,  countApiConfigs,  updateApiConfig,  deleteApiConfig,} from "../repositories/apiConfig.repository.js";
import { getPagination } from "../utils/pagination.js";

// CREATE
export async function createApiConfigService(data) {
  const {
    name,
    baseUrl,
    apiKey,
    apiSecret,
    isActive = true,
    description,
  } = data;

  // Normalize name
    const normalizedName =
    name.trim().toUpperCase();
  
  // Check duplicate
  
  const existing =
    await findApiConfigByName(
      normalizedName
    );

  if (existing) {
    throw new Error(
      "API configuration with this name already exists."
    );
  }

   // Validate URL if provided
  
  if (baseUrl) {
    try {
      new URL(baseUrl);
    } catch {
      throw new Error(
        "Invalid base URL."
      );
    }
  }

  return createApiConfig({
    name: normalizedName,
    baseUrl,
    apiKey,
    apiSecret,
    isActive,
    description,
  });
}

// GET ALL
export async function getApiConfigsService({
  page = 1,
  limit = 10,
  search,
  isActive,
}) {
  const { skip, take } =
    getPagination(page, limit);

  const where = {};
  
  // Search
  
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

    // Active filter
  
  if (isActive !== undefined) {
    where.isActive =
      isActive === true ||
      isActive === "true";
  }

  const [
    apiConfigs,
    total,
  ] = await Promise.all([
    findApiConfigs({
      skip,
      take,
      where,
      orderBy: {
        createdAt: "desc",
      },
    }),

    countApiConfigs(where),
  ]);

  return {
    apiConfigs,
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
 
// GET BY ID
 
export async function getApiConfigByIdService(
  id
) {
  const apiConfig =
    await findApiConfigById(id);

  if (!apiConfig) {
    throw new Error(
      "API configuration not found."
    );
  }

  return apiConfig;
}
 
// GET BY NAME
 
export async function getApiConfigByNameService(
  name
) {
  const normalizedName =
    name.trim().toUpperCase();

  const apiConfig =
    await findApiConfigByName(
      normalizedName
    );

  if (!apiConfig) {
    throw new Error(
      "API configuration not found."
    );
  }

  return apiConfig;
}

 // UPDATE
 
export async function updateApiConfigService(
  id,
  data
) {
  const existing =
    await findApiConfigById(id);

  if (!existing) {
    throw new Error(
      "API configuration not found."
    );
  }

  const updateData = {};  

  // Name
  
  if (data.name !== undefined) {
    const normalizedName =
      data.name.trim().toUpperCase();

    if (
      normalizedName !==
      existing.name
    ) {
      const duplicate =
        await findApiConfigByName(
          normalizedName
        );

      if (duplicate) {
        throw new Error(
          "API configuration with this name already exists."
        );
      }

      updateData.name =
        normalizedName;
    }
  }

    // URL
    if (data.baseUrl !== undefined) {
    if (data.baseUrl) {
      try {
        new URL(data.baseUrl);
      } catch {
        throw new Error(
          "Invalid base URL."
        );
      }
    }

    updateData.baseUrl =
      data.baseUrl;
  }

     // Other fields
 
  if (data.apiKey !== undefined) {
    updateData.apiKey =
      data.apiKey;
  }

  if (data.apiSecret !== undefined) {
    updateData.apiSecret =
      data.apiSecret;
  }

  if (data.isActive !== undefined) {
    updateData.isActive =
      data.isActive;
  }

  if (
    data.description !== undefined
  ) {
    updateData.description =
      data.description;
  }

  return updateApiConfig(
    id,
    updateData
  );
}
 
// DELETE
 export async function deleteApiConfigService(
  id
) {
  const existing =
    await findApiConfigById(id);

  if (!existing) {
    throw new Error(
      "API configuration not found."
    );
  }

  return deleteApiConfig(id);
}