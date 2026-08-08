import { createAdsBanner, findAdsBannerById, findAdsBanners, countAdsBanners, updateAdsBanner, deleteAdsBanner, } from "../repositories/adsBanner.repository.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary, } from "../utils/cloudinary.js";
import { getPagination } from "../utils/pagination.js";

// CREATE ADS BANNER
export async function createAdsBannerService(
    data,
    file
) {
    if (!file) {
        throw new Error("Advertisement image is required.");
    }

    const {
        title,
        description,
        linkUrl,
        buttonText,
        position = "HOME",
        sortOrder = 0,
        isActive = true,
        startDate,
        endDate,
    } = data;

    // Parse dates
    const parsedStartDate = startDate
        ? new Date(startDate)
        : null;

    const parsedEndDate = endDate
        ? new Date(endDate)
        : null;

    if (
        parsedStartDate &&
        Number.isNaN(parsedStartDate.getTime())
    ) {
        throw new Error("Invalid start date.");
    }

    if (
        parsedEndDate &&
        Number.isNaN(parsedEndDate.getTime())
    ) {
        throw new Error("Invalid end date.");
    }

    if (
        parsedStartDate &&
        parsedEndDate &&
        parsedStartDate >= parsedEndDate
    ) {
        throw new Error(
            "End date must be after start date."
        );
    }

    // Upload image
    const uploaded =
        await uploadImageToCloudinary(
            file.buffer,
            "ads-banners"
        );

    try {
        return await createAdsBanner({
            title,
            description,
            imageUrl: uploaded.secure_url,
            imagePublicId: uploaded.public_id,
            linkUrl,
            buttonText,
            position,
            sortOrder: Number(sortOrder),
            isActive,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
        });
    } catch (error) {
        // Database failed after Cloudinary upload.
        // Remove the newly uploaded image.
        await deleteImageFromCloudinary(
            uploaded.public_id
        ).catch(() => { });

        throw error;
    }
}

// GET ADS BANNERS
export async function getAdsBannersService({
    page = 1,
    limit = 10,
    search,
    position,
    isActive,
    publicOnly = false,
}) {
    const { skip, take } =
        getPagination(page, limit);

    const where = {};

    // Search
    if (search) {
        where.OR = [
            {
                title: {
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

    // Position
    if (position) {
        where.position = position;
    }

    // Active filter
    if (isActive !== undefined) {
        where.isActive =
            isActive === true ||
            isActive === "true";
    }

    // Public ads
    if (publicOnly) {
        const now = new Date();

        where.isActive = true;

        where.AND = [
            {
                OR: [
                    {
                        startDate: null,
                    },
                    {
                        startDate: {
                            lte: now,
                        },
                    },
                ],
            },
            {
                OR: [
                    {
                        endDate: null,
                    },
                    {
                        endDate: {
                            gte: now,
                        },
                    },
                ],
            },
        ];
    }

    const [
        adsBanners,
        total,
    ] = await Promise.all([
        findAdsBanners({
            skip,
            take,
            where,
            orderBy: [
                {
                    sortOrder: "asc",
                },
                {
                    createdAt: "desc",
                },
            ],
        }),

        countAdsBanners(where),
    ]);

    return {
        adsBanners,

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

// GET ADS BANNER BY ID
export async function getAdsBannerByIdService(
    id
) {
    const adsBanner =
        await findAdsBannerById(id);

    if (!adsBanner) {
        throw new Error(
            "Advertisement banner not found."
        );
    }

    return adsBanner;
}

// UPDATE ADS BANNER
export async function updateAdsBannerService(
    id,
    data,
    file
) {
    const existing =
        await findAdsBannerById(id);

    if (!existing) {
        throw new Error(
            "Advertisement banner not found."
        );
    }

    const updateData = {};

    // Text fields
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

    if (data.linkUrl !== undefined) {
        updateData.linkUrl =
            data.linkUrl;
    }

    if (data.buttonText !== undefined) {
        updateData.buttonText =
            data.buttonText;
    }

    if (data.position !== undefined) {
        updateData.position =
            data.position;
    }

    if (data.sortOrder !== undefined) {
        updateData.sortOrder =
            Number(data.sortOrder);
    }

    if (data.isActive !== undefined) {
        updateData.isActive =
            data.isActive;
    }

    // Dates
    let parsedStartDate =
        existing.startDate;

    let parsedEndDate =
        existing.endDate;

    if (data.startDate !== undefined) {
        parsedStartDate =
            data.startDate
                ? new Date(data.startDate)
                : null;

        if (
            parsedStartDate &&
            Number.isNaN(
                parsedStartDate.getTime()
            )
        ) {
            throw new Error(
                "Invalid start date."
            );
        }

        updateData.startDate =
            parsedStartDate;
    }

    if (data.endDate !== undefined) {
        parsedEndDate =
            data.endDate
                ? new Date(data.endDate)
                : null;

        if (
            parsedEndDate &&
            Number.isNaN(
                parsedEndDate.getTime()
            )
        ) {
            throw new Error(
                "Invalid end date."
            );
        }

        updateData.endDate =
            parsedEndDate;
    }

    if (
        parsedStartDate &&
        parsedEndDate &&
        parsedStartDate >= parsedEndDate
    ) {
        throw new Error(
            "End date must be after start date."
        );
    }

    // Replace image
    let uploaded = null;

    if (file) {
        uploaded =
            await uploadImageToCloudinary(
                file.buffer,
                "ads-banners"
            );

        updateData.imageUrl =
            uploaded.secure_url;

        updateData.imagePublicId =
            uploaded.public_id;
    }

    try {
        const updated =
            await updateAdsBanner(
                id,
                updateData
            );

        // Delete old Cloudinary image
        // only after successful DB update.
        if (
            uploaded &&
            existing.imagePublicId
        ) {
            await deleteImageFromCloudinary(
                existing.imagePublicId
            ).catch(() => { });
        }

        return updated;
    } catch (error) {
        // DB failed, so clean up the new image.
        if (uploaded) {
            await deleteImageFromCloudinary(
                uploaded.public_id
            ).catch(() => { });
        }

        throw error;
    }
}

// DELETE ADS BANNER
export async function deleteAdsBannerService(
    id
) {
    const existing =
        await findAdsBannerById(id);

    if (!existing) {
        throw new Error(
            "Advertisement banner not found."
        );
    }

    const deleted =
        await deleteAdsBanner(id);

    // Delete image from Cloudinary.
    if (existing.imagePublicId) {
        await deleteImageFromCloudinary(
            existing.imagePublicId
        ).catch(() => { });
    }

    return deleted;
}