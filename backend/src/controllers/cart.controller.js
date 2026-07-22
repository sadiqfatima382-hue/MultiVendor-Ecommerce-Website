import { success } from "zod";
import { addToCartService, getCartService, updateCartItemService, removeCartItemService, clearCartService, } from "../services/cart.service.js";

export async function addToCart(req, res, next) {
    try {
        const addToCart = await addToCartService(req.user.id,req.validatedData)
        return res.status(200).json({
            success: true,
            message: "Added to cart successfully.",
            data: addToCart,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

export async function getCart(req, res, next) {
    try {
        const result = await getCartService(req.user.id, req.query);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json
            ({
                success: false,
                message: error.message
            })
    }
}

export async function updateCartItem(req, res, next) {
    try {
        const result = await updateCartItemService(req.params.itemId, req.validatedData);

        res.status(200).json({
            success: true,
            message: "Cart Items updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function removeCartItem(req, res, next) {
    try {
        const result = await removeCartItemservice(req.params.itemId);

        res.status(200).json({
            success: true,
            message: "Cart items removed",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function clearCart(req, res, next) {
    try {
        const result = await clearCartService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: result,
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}