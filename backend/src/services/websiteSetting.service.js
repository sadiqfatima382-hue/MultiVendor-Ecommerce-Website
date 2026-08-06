import { createWebsiteSetting, findWebsiteSetting, updateWebsiteSetting, } from "../repositories/websiteSetting.repository.js";

export async function createWebsiteSettingService(
    body
) {
    const existing =
        await findWebsiteSetting();

    if (existing) {
        throw new Error(
            "Website setting already exists."
        );
    }

    return createWebsiteSetting(body);
}

export async function getWebsiteSettingService() {
    return await findWebsiteSetting();
}

export async function updateWebsiteSettingService(
    body
) {
    const setting =
        await findWebsiteSetting();

    if (!setting) {
        throw new Error(
            "Website setting not found."
        );
    }

    return updateWebsiteSetting(
        setting.id,
        body
    );
}