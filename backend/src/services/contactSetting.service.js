import {
  createContactSetting,
  findContactSettingById,
  findActiveContactSetting,
  findContactSettings,
  countContactSettings,
  updateContactSetting,
  deleteContactSetting,
} from "../repositories/contactSetting.repository.js";

import { getPagination } from "../utils/pagination.js";


// =====================================================
// CREATE
// =====================================================

export async function createContactSettingService(data) {
  const {
    email,
    phone,
    whatsapp,
    address,
    googleMapUrl,
    workingHours,
    facebookUrl,
    instagramUrl,
    twitterUrl,
    linkedinUrl,
    youtubeUrl,
    isActive = true,
  } = data;

  // ---------------------------------------------------
  // Validate URLs
  // ---------------------------------------------------

  const urls = [
    {
      name: "Google Maps URL",
      value: googleMapUrl,
    },
    {
      name: "Facebook URL",
      value: facebookUrl,
    },
    {
      name: "Instagram URL",
      value: instagramUrl,
    },
    {
      name: "Twitter URL",
      value: twitterUrl,
    },
    {
      name: "LinkedIn URL",
      value: linkedinUrl,
    },
    {
      name: "YouTube URL",
      value: youtubeUrl,
    },
  ];

  for (const url of urls) {
    if (url.value) {
      try {
        new URL(url.value);
      } catch {
        throw new Error(
          `${url.name} is invalid.`
        );
      }
    }
  }

  // ---------------------------------------------------
  // If this setting is active,
  // deactivate previous active setting
  // ---------------------------------------------------

  if (isActive) {
    const existing =
      await findActiveContactSetting();

    if (existing) {
      await updateContactSetting(
        existing.id,
        {
          isActive: false,
        }
      );
    }
  }

  return createContactSetting({
    email,
    phone,
    whatsapp,
    address,
    googleMapUrl,
    workingHours,
    facebookUrl,
    instagramUrl,
    twitterUrl,
    linkedinUrl,
    youtubeUrl,
    isActive,
  });
}


// =====================================================
// GET ALL
// =====================================================

export async function getContactSettingsService({
  page = 1,
  limit = 10,
  isActive,
}) {
  const { skip, take } =
    getPagination(page, limit);

  const where = {};

  if (isActive !== undefined) {
    where.isActive =
      isActive === true ||
      isActive === "true";
  }

  const [
    settings,
    total,
  ] = await Promise.all([
    findContactSettings({
      skip,
      take,
      where,
      orderBy: {
        createdAt: "desc",
      },
    }),

    countContactSettings(where),
  ]);

  return {
    settings,

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

export async function getContactSettingByIdService(
  id
) {
  const setting =
    await findContactSettingById(id);

  if (!setting) {
    throw new Error(
      "Contact setting not found."
    );
  }

  return setting;
}


// =====================================================
// GET ACTIVE
// =====================================================

export async function getActiveContactSettingService() {
  const setting =
    await findActiveContactSetting();

  if (!setting) {
    throw new Error(
      "Active contact setting not found."
    );
  }

  return setting;
}


// =====================================================
// UPDATE
// =====================================================

export async function updateContactSettingService(
  id,
  data
) {
  const existing =
    await findContactSettingById(id);

  if (!existing) {
    throw new Error(
      "Contact setting not found."
    );
  }

  const updateData = {};

  const urlFields = [
    "googleMapUrl",
    "facebookUrl",
    "instagramUrl",
    "twitterUrl",
    "linkedinUrl",
    "youtubeUrl",
  ];

  // ---------------------------------------------------
  // Validate URLs
  // ---------------------------------------------------

  for (const field of urlFields) {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      data[field] !== ""
    ) {
      try {
        new URL(data[field]);
      } catch {
        throw new Error(
          `${field} is invalid.`
        );
      }
    }
  }

  // ---------------------------------------------------
  // Copy allowed fields
  // ---------------------------------------------------

  const fields = [
    "email",
    "phone",
    "whatsapp",
    "address",
    "googleMapUrl",
    "workingHours",
    "facebookUrl",
    "instagramUrl",
    "twitterUrl",
    "linkedinUrl",
    "youtubeUrl",
    "isActive",
  ];

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] =
        data[field];
    }
  }

  // ---------------------------------------------------
  // Activate this setting
  // ---------------------------------------------------

  if (data.isActive === true) {
    const activeSetting =
      await findActiveContactSetting();

    if (
      activeSetting &&
      activeSetting.id !== id
    ) {
      await updateContactSetting(
        activeSetting.id,
        {
          isActive: false,
        }
      );
    }
  }

  return updateContactSetting(
    id,
    updateData
  );
}


// =====================================================
// DELETE
// =====================================================

export async function deleteContactSettingService(
  id
) {
  const existing =
    await findContactSettingById(id);

  if (!existing) {
    throw new Error(
      "Contact setting not found."
    );
  }

  if (existing.isActive) {
    throw new Error(
      "Active contact setting cannot be deleted. Deactivate it first."
    );
  }

  return deleteContactSetting(id);
}