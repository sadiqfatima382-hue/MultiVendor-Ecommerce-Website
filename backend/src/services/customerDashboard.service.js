import { countCartItems, sumCustomerSpending, sumCustomerProductsPurchased, countCustomerOrders, countAddresses, getRecentCustomerOrders, getRecentWishlist, getCartPreview } from "../repositories/customerDashboard.repository.js";
import { countWishlistItems } from "../repositories/wishlist.repository.js"
import { getRecommendedProducts } from "../repositories/product.repository.js";
export async function getCustomerDashboardService(userId) {
    const [

        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        refundedOrders,

        wishlistItems,
        cartItems,
        addresses,
        totalSpent,
        productsPurchased,

        recentOrders,
        recentWishlist,
        cartPreview,
        recommendedProducts,

    ] = await Promise.all([
        countCustomerOrders(userId),
        countCustomerOrders(userId, { status: "PENDING", }),
        countCustomerOrders(userId, { status: "CONFIRMED", }),
        countCustomerOrders(userId, { status: "PROCESSING", }),
        countCustomerOrders(userId, { status: "SHIPPED", }),
        countCustomerOrders(userId, { status: "DELIVERED", }),
        countCustomerOrders(userId, { status: "CANCELLED", }),
        countCustomerOrders(userId, { status: "RETURNED", }),
        countCustomerOrders(userId, { status: "REFUNDED", }),

        countWishlistItems(userId),

        countCartItems(userId),

        countAddresses(userId),

        sumCustomerSpending(userId),

        sumCustomerProductsPurchased(userId),

        getRecentCustomerOrders(userId),

        getRecentWishlist(userId),

        getCartPreview(userId),

        getRecommendedProducts(),
    ]);

    return {

        orders: {

            totalOrders,
            pendingOrders,
            confirmedOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            returnedOrders,
            refundedOrders,

        },

        wishlistItems: { totalItems: wishlistItems, },

        cart: { totalItems: cartItems, },

        addresses: { totalAddresses: addresses, },

        spending: { totalSpent, productsPurchased, },

        activity: {
            recentOrders,
            recentWishlist,
            cartPreview,
        },

        recommendations: {
            products: recommendedProducts,
        }
    };


}