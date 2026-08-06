import { createWebsiteIcon, findWebsiteIconById, findWebsiteIconByType, getWebsiteIcons, updateWebsiteIcon, deleteWebsiteIcon, } from "../repositories/websiteIcon.repository.js";

import { uploadImageToCloudinary, deleteImageFromCloudinary, } from "../utils/cloudinary.js";

export async function createWebsiteIconService(body, file) {
    const existing =
        await findWebsiteIconByType(body.type);

    if (existing) {
        throw new Error(
            "This icon type already exists."
        );
    }

    if (!file) {
        throw new Error("Image is required.");
    }

    const uploaded =
        await uploadImageToCloudinary(
            file.buffer,
            "website-icons"
        );

    return createWebsiteIcon({
        type: body.type,
        imageUrl: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
        altText: body.altText,
    });
}

export async function getWebsiteIconsService() {
    return getWebsiteIcons();
}

export async function getWebsiteIconByTypeService(
    type
) {
    const icon =
        await findWebsiteIconByType(type);

    if (!icon) {
        throw new Error(
            "Website icon not found."
        );
    }

    return icon;
}

export async function updateWebsiteIconService(
    type,
    body,
    file
) {
    const icon =
        await findWebsiteIconByType(type);

    if (!icon) {
        throw new Error(
            "Website icon not found."
        );
    }

    const updateData = {
        altText:
            body.altText ?? icon.altText,
    };

    if (file) {
        const uploaded =
            await uploadImageToCloudinary(
                file.buffer,
                "website-icons"
            );

        await deleteImageFromCloudinary(
            icon.imagePublicId
        );

        updateData.imageUrl =
            uploaded.secure_url;

        updateData.imagePublicId =
            uploaded.public_id;
    }

    return updateWebsiteIcon(
        icon.id,
        updateData
    );
}

export async function deleteWebsiteIconService(
    type
) {
    const icon =
        await findWebsiteIconByType(type);

    if (!icon) {
        throw new Error(
            "Website icon not found."
        );
    }

    await deleteImageFromCloudinary(
        icon.imagePublicId
    );

    await deleteWebsiteIcon(icon.id);

    return;
}