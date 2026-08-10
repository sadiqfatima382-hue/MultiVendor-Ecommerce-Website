import {
  createCareer,
  findCareerById,
  findCareerBySlug,
  findCareers,
  countCareers,
  updateCareer,
  deleteCareer,
} from "../repositories/career.repository.js";

import { generateSlug } from "../utils/slug.js";

import { getPagination } from "../utils/pagination.js";


// =====================================================
// HELPERS
// =====================================================

function parseBoolean(value) {
  return (
    value === true ||
    value === "true"
  );
}


function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Invalid date provided."
    );
  }

  return date;
}


function parseDecimal(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(
      "Invalid salary value."
    );
  }

  if (number < 0) {
    throw new Error(
      "Salary cannot be negative."
    );
  }

  return number;
}


// =====================================================
// CREATE
// =====================================================

export async function createCareerService(
  data
) {
  const {
    title,
    department,
    location,
    employmentType,
    description,
    requirements,
    responsibilities,
    salaryMin,
    salaryMax,
    salaryCurrency,
    vacancies = 1,
    isPublished = false,
    isActive = true,
    publishedAt,
    applicationDeadline,
  } = data;

  if (!title?.trim()) {
    throw new Error(
      "Career title is required."
    );
  }

  if (!description?.trim()) {
    throw new Error(
      "Career description is required."
    );
  }

  // ---------------------------------------------------
  // Salary
  // ---------------------------------------------------

  const finalSalaryMin =
    parseDecimal(salaryMin);

  const finalSalaryMax =
    parseDecimal(salaryMax);

  if (
    finalSalaryMin !== null &&
    finalSalaryMax !== null &&
    finalSalaryMin > finalSalaryMax
  ) {
    throw new Error(
      "Minimum salary cannot be greater than maximum salary."
    );
  }

  // ---------------------------------------------------
  // Vacancies
  // ---------------------------------------------------

  const finalVacancies =
    Number(vacancies);

  if (
    !Number.isInteger(finalVacancies) ||
    finalVacancies < 1
  ) {
    throw new Error(
      "Vacancies must be at least 1."
    );
  }

  // ---------------------------------------------------
  // Slug
  // ---------------------------------------------------

  const baseSlug =
    generateSlug(title);

  let slug = baseSlug;

  let counter = 1;

  while (
    await findCareerBySlug(slug)
  ) {
    slug =
      `${baseSlug}-${counter}`;

    counter++;
  }

  // ---------------------------------------------------
  // Publish
  // ---------------------------------------------------

  const published =
    parseBoolean(isPublished);

  const active =
    parseBoolean(isActive);

  let finalPublishedAt =
    parseDate(publishedAt);

  if (published && !finalPublishedAt) {
    finalPublishedAt =
      new Date();
  }

  if (!published) {
    finalPublishedAt = null;
  }

  // ---------------------------------------------------
  // Deadline
  // ---------------------------------------------------

  const finalDeadline =
    parseDate(applicationDeadline);

  if (
    finalDeadline &&
    finalDeadline < new Date()
  ) {
    throw new Error(
      "Application deadline cannot be in the past."
    );
  }

  return createCareer({
    title: title.trim(),

    slug,

    department:
      department?.trim() || null,

    location:
      location?.trim() || null,

    employmentType:
      employmentType?.trim() || null,

    description:
      description.trim(),

    requirements:
      requirements?.trim() || null,

    responsibilities:
      responsibilities?.trim() || null,

    salaryMin:
      finalSalaryMin,

    salaryMax:
      finalSalaryMax,

    salaryCurrency:
      salaryCurrency?.trim() || "PKR",

    vacancies:
      finalVacancies,

    isPublished:
      published,

    isActive:
      active,

    publishedAt:
      finalPublishedAt,

    applicationDeadline:
      finalDeadline,
  });
}


// =====================================================
// GET ALL
// =====================================================

export async function getCareersService({
  page = 1,
  limit = 10,
  search,
  department,
  employmentType,
  isPublished,
  isActive,
  publicOnly = false,
}) {
  const {
    skip,
    take,
  } = getPagination(
    page,
    limit
  );

  const where = {};

  // ---------------------------------------------------
  // Public
  // ---------------------------------------------------

  if (publicOnly) {
    where.isPublished = true;
    where.isActive = true;
  } else {
    if (isPublished !== undefined) {
      where.isPublished =
        parseBoolean(isPublished);
    }

    if (isActive !== undefined) {
      where.isActive =
        parseBoolean(isActive);
    }
  }

  // ---------------------------------------------------
  // Search
  // ---------------------------------------------------

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        department: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        location: {
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

  // ---------------------------------------------------
  // Department
  // ---------------------------------------------------

  if (department) {
    where.department = {
      equals: department,
      mode: "insensitive",
    };
  }

  // ---------------------------------------------------
  // Employment type
  // ---------------------------------------------------

  if (employmentType) {
    where.employmentType = {
      equals: employmentType,
      mode: "insensitive",
    };
  }

  const [
    careers,
    total,
  ] = await Promise.all([
    findCareers({
      skip,
      take,
      where,

      orderBy: {
        createdAt: "desc",
      },
    }),

    countCareers(where),
  ]);

  return {
    careers,

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


// =====================================================
// GET BY ID
// =====================================================

export async function getCareerByIdService(
  id,
  publicOnly = false
) {
  const career =
    await findCareerById(id);

  if (!career) {
    throw new Error(
      "Career not found."
    );
  }

  if (
    publicOnly &&
    (!career.isPublished ||
      !career.isActive)
  ) {
    throw new Error(
      "Career not found."
    );
  }

  return career;
}


// =====================================================
// GET BY SLUG
// =====================================================

export async function getCareerBySlugService(
  slug,
  publicOnly = true
) {
  const career =
    await findCareerBySlug(slug);

  if (!career) {
    throw new Error(
      "Career not found."
    );
  }

  if (
    publicOnly &&
    (!career.isPublished ||
      !career.isActive)
  ) {
    throw new Error(
      "Career not found."
    );
  }

  return career;
}


// =====================================================
// UPDATE
// =====================================================

export async function updateCareerService(
  id,
  data
) {
  const existing =
    await findCareerById(id);

  if (!existing) {
    throw new Error(
      "Career not found."
    );
  }

  const updateData = {};

  // ---------------------------------------------------
  // TITLE + SLUG
  // ---------------------------------------------------

  if (data.title !== undefined) {
    const title =
      data.title.trim();

    if (!title) {
      throw new Error(
        "Career title cannot be empty."
      );
    }

    updateData.title =
      title;

    if (
      title !== existing.title
    ) {
      const baseSlug =
        generateSlug(title);

      let slug = baseSlug;

      let counter = 1;

      while (true) {
        const duplicate =
          await findCareerBySlug(
            slug
          );

        if (
          !duplicate ||
          duplicate.id === id
        ) {
          break;
        }

        slug =
          `${baseSlug}-${counter}`;

        counter++;
      }

      updateData.slug =
        slug;
    }
  }

  // ---------------------------------------------------
  // TEXT FIELDS
  // ---------------------------------------------------

  const textFields = [
    "department",
    "location",
    "employmentType",
    "description",
    "requirements",
    "responsibilities",
    "salaryCurrency",
  ];

  for (const field of textFields) {
    if (
      data[field] !== undefined
    ) {
      updateData[field] =
        data[field]?.trim() || null;
    }
  }

  // Description cannot be empty

  if (
    updateData.description === ""
  ) {
    throw new Error(
      "Career description cannot be empty."
    );
  }

  // ---------------------------------------------------
  // SALARY
  // ---------------------------------------------------

  if (
    data.salaryMin !== undefined
  ) {
    updateData.salaryMin =
      parseDecimal(
        data.salaryMin
      );
  }

  if (
    data.salaryMax !== undefined
  ) {
    updateData.salaryMax =
      parseDecimal(
        data.salaryMax
      );
  }

  const finalMin =
    updateData.salaryMin !== undefined
      ? updateData.salaryMin
      : existing.salaryMin;

  const finalMax =
    updateData.salaryMax !== undefined
      ? updateData.salaryMax
      : existing.salaryMax;

  if (
    finalMin !== null &&
    finalMax !== null &&
    Number(finalMin) >
      Number(finalMax)
  ) {
    throw new Error(
      "Minimum salary cannot be greater than maximum salary."
    );
  }

  // ---------------------------------------------------
  // VACANCIES
  // ---------------------------------------------------

  if (
    data.vacancies !== undefined
  ) {
    const vacancies =
      Number(data.vacancies);

    if (
      !Number.isInteger(vacancies) ||
      vacancies < 1
    ) {
      throw new Error(
        "Vacancies must be at least 1."
      );
    }

    updateData.vacancies =
      vacancies;
  }

  // ---------------------------------------------------
  // PUBLISH
  // ---------------------------------------------------

  if (
    data.isPublished !== undefined
  ) {
    const published =
      parseBoolean(
        data.isPublished
      );

    updateData.isPublished =
      published;

    if (published) {
      updateData.publishedAt =
        data.publishedAt
          ? parseDate(
              data.publishedAt
            )
          : existing.publishedAt ||
            new Date();
    } else {
      updateData.publishedAt =
        null;
    }
  }

  // ---------------------------------------------------
  // ACTIVE
  // ---------------------------------------------------

  if (
    data.isActive !== undefined
  ) {
    updateData.isActive =
      parseBoolean(
        data.isActive
      );
  }

  // ---------------------------------------------------
  // PUBLISHED DATE
  // ---------------------------------------------------

  if (
    data.publishedAt !== undefined &&
    data.isPublished === undefined
  ) {
    updateData.publishedAt =
      parseDate(
        data.publishedAt
      );
  }

  // ---------------------------------------------------
  // DEADLINE
  // ---------------------------------------------------

  if (
    data.applicationDeadline !==
    undefined
  ) {
    const deadline =
      parseDate(
        data.applicationDeadline
      );

    if (
      deadline &&
      deadline < new Date()
    ) {
      throw new Error(
        "Application deadline cannot be in the past."
      );
    }

    updateData.applicationDeadline =
      deadline;
  }

  return updateCareer(
    id,
    updateData
  );
}


// =====================================================
// PUBLISH
// =====================================================

export async function publishCareerService(
  id
) {
  const career =
    await findCareerById(id);

  if (!career) {
    throw new Error(
      "Career not found."
    );
  }

  if (!career.isActive) {
    throw new Error(
      "Inactive career cannot be published."
    );
  }

  if (career.isPublished) {
    throw new Error(
      "Career is already published."
    );
  }

  return updateCareer(
    id,
    {
      isPublished: true,
      publishedAt: new Date(),
    }
  );
}


// =====================================================
// UNPUBLISH
// =====================================================

export async function unpublishCareerService(
  id
) {
  const career =
    await findCareerById(id);

  if (!career) {
    throw new Error(
      "Career not found."
    );
  }

  if (!career.isPublished) {
    throw new Error(
      "Career is already unpublished."
    );
  }

  return updateCareer(
    id,
    {
      isPublished: false,
      publishedAt: null,
    }
  );
}


// =====================================================
// OPEN / CLOSE
// =====================================================

export async function setCareerActiveService(
  id,
  isActive
) {
  const career =
    await findCareerById(id);

  if (!career) {
    throw new Error(
      "Career not found."
    );
  }

  const active =
    parseBoolean(isActive);

  return updateCareer(
    id,
    {
      isActive: active,
    }
  );
}


// =====================================================
// DELETE
// =====================================================

export async function deleteCareerService(
  id
) {
  const career =
    await findCareerById(id);

  if (!career) {
    throw new Error(
      "Career not found."
    );
  }

  return deleteCareer(id);
}