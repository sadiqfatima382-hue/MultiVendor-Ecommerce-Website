import { createBanner, findBannerById, findBanners, countBanners, updateBanner, deleteBanner, } from "../repositories/banner.repository.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary, } from "../utils/cloudinary.js";
import { getPagination } from "../utils/pagination.js";

// CREATE BANNER

export async function createBannerService(
    data,
    file
) {
    if (!file) {
        throw new Error("Banner image is required.");
    }

    const {
        title,
        subtitle,
        linkUrl,
        buttonText,
        position = "HOME",
        sortOrder = 0,
        isActive = true,
        startDate,
        endDate,
    } = data;

    // Validate dates

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
            "banners"
        );

    try {
        return await createBanner({
            title,
            subtitle,
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
        // If DB creation fails after Cloudinary
        // upload, remove the uploaded image.
        await deleteImageFromCloudinary(
            uploaded.public_id
        ).catch(() => { });

        throw error;
    }
}

// GET BANNERS

export async function getBannersService({
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
                subtitle: {
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

    // Public banners

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
        banners,
        total,
    ] = await Promise.all([
        findBanners({
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

        countBanners(where),
    ]);

    return {
        banners,

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

// GET BANNER BY ID

export async function getBannerByIdService(
    id
) {
    const banner =
        await findBannerById(id);

    if (!banner) {
        throw new Error(
            "Banner not found."
        );
    }

    return banner;
}

// UPDATE BANNER

export async function updateBannerService(
    id,
    data,
    file
) {
    const existing =
        await findBannerById(id);

    if (!existing) {
        throw new Error(
            "Banner not found."
        );
    }

    const updateData = {};

    // Text fields

    if (data.title !== undefined) {
        updateData.title =
            data.title;
    }

    if (data.subtitle !== undefined) {
        updateData.subtitle =
            data.subtitle;
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

    // Image replacement

    let uploaded = null;

    if (file) {
        uploaded =
            await uploadImageToCloudinary(
                file.buffer,
                "banners"
            );

        updateData.imageUrl =
            uploaded.secure_url;

        updateData.imagePublicId =
            uploaded.public_id;
    }

    try {
        const updated =
            await updateBanner(
                id,
                updateData
            );

        // Delete old image only after
        // successful database update.
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
        // DB update failed, so remove the
        // newly uploaded image.
        if (uploaded) {
            await deleteImageFromCloudinary(
                uploaded.public_id
            ).catch(() => { });
        }

        throw error;
    }
}

// DELETE BANNER


export async function deleteBannerService(
    id
) {
    const existing =
        await findBannerById(id);

    if (!existing) {
        throw new Error(
            "Banner not found."
        );
    }

    const deleted =
        await deleteBanner(id);

    // Remove image from Cloudinary.
    if (existing.imagePublicId) {
        await deleteImageFromCloudinary(
            existing.imagePublicId
        ).catch(() => { });
    }

    return deleted;
}