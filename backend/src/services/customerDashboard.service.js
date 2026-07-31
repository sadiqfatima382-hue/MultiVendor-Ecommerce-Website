import { countCartItems, countWishlistItems, sumCustomerSpending, sumCustomerProductsPurchased, countCustomerOrders,countAddresses } from "../repositories/customerDashboard.repository";
import {countwishlistItems} from "../repositories/wishlist.repository"
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

};
}