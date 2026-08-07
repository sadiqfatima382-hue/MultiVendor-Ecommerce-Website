import { createComponentType, findComponentTypeById, findComponentTypeBySlug, findComponentTypeByName, findComponentTypes, countComponentTypes, updateComponentType, deleteComponentType, } from "../repositories/componentType.repository.js";
import { generateSlug } from "../utils/slug.js";
import { getPagination } from "../utils/pagination.js";

export async function createComponentTypeService(data) {
    const { name, description, isActive = true } = data;

    const existingName =
        await findComponentTypeByName(name);

    if (existingName) {
        throw new Error(
            "Component type with this name already exists."
        );
    }

    const slug = generateSlug(name);

    const existingSlug =
        await findComponentTypeBySlug(slug);

    if (existingSlug) {
        throw new Error(
            "Component type with this slug already exists."
        );
    }

    return createComponentType({
        name,
        slug,
        description,
        isActive,
    });
}

export async function getComponentTypesService({
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
        ];
    }

    if (isActive !== undefined) {
        where.isActive =
            isActive === true ||
            isActive === "true";
    }

    const [componentTypes, total] =
        await Promise.all([
            findComponentTypes({
                skip,
                take,
                where,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            countComponentTypes(where),
        ]);

    return {
        componentTypes,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(
                total / Number(limit)
            ),
        },
    };
}

export async function getComponentTypeByIdService(
    id
) {
    const componentType =
        await findComponentTypeById(id);

    if (!componentType) {
        throw new Error(
            "Component type not found."
        );
    }

    return componentType;
}

export async function updateComponentTypeService(
    id,
    data
) {
    const componentType =
        await findComponentTypeById(id);

    if (!componentType) {
        throw new Error(
            "Component type not found."
        );
    }

    const updateData = {};

    if (data.name !== undefined) {
        const existingName =
            await findComponentTypeByName(
                data.name
            );

        if (
            existingName &&
            existingName.id !== id
        ) {
            throw new Error(
                "Component type with this name already exists."
            );
        }

        const newSlug =
            generateSlug(data.name);

        const existingSlug =
            await findComponentTypeBySlug(
                newSlug
            );

        if (
            existingSlug &&
            existingSlug.id !== id
        ) {
            throw new Error(
                "Component type with this slug already exists."
            );
        }

        updateData.name = data.name;
        updateData.slug = newSlug;
    }

    if (data.description !== undefined) {
        updateData.description =
            data.description;
    }

    if (data.isActive !== undefined) {
        updateData.isActive =
            data.isActive;
    }

    return updateComponentType(
        id,
        updateData
    );
}

export async function deleteComponentTypeService(
    id
) {
    const componentType =
        await findComponentTypeById(id);

    if (!componentType) {
        throw new Error(
            "Component type not found."
        );
    }

    return deleteComponentType(id);
}