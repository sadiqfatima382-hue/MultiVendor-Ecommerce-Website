import { createComponentTypeService, getComponentTypesService, getComponentTypeByIdService, updateComponentTypeService, deleteComponentTypeService, } from "../services/componentType.service.js";

export async function createComponentType(req, res) {
    try {
        const componentType =
            await createComponentTypeService(req.body);

        return res.status(201).json({
            success: true,
            message: "Component type created successfully.",
            data: componentType,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getComponentTypes(req, res) {
    try {
        const result = await getComponentTypesService({
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            isActive: req.query.isActive,
        });

        return res.status(200).json({
            success: true,
            data: result.componentTypes,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getComponentTypeById(req, res) {
    try {
        const componentType =
            await getComponentTypeByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            data: componentType,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

export async function updateComponentType(req, res) {
    try {
        const componentType =
            await updateComponentTypeService(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Component type updated successfully.",
            data: componentType,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function deleteComponentType(req, res) {
    try {
        await deleteComponentTypeService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Component type deleted successfully.",
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}