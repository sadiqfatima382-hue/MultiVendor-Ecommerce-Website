import { countCartItems, sumCustomerSpending, sumCustomerProductsPurchased, countCustomerOrders, countAddresses, getRecentCustomerOrders, getRecentWishlist, getCartPreview } from "../repositories/customerDashboard.repository.js";
import { countWishlistItems } from "../repositories/wishlist.repository.js"
import { getRecommendedProducts } from "../repositories/product.repository.js";
export async function getCustomerDashboardService(userId) {
    const currentYear = new Date().getFullYear();
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

        monthlySpending,
monthlyOrders,
favoriteCategories,
favoriteBrands,
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

        getMonthlyCustomerSpending(userId, currentYear),

getMonthlyCustomerOrders(userId, currentYear),

getFavoriteCategories(userId),

getFavoriteBrands(userId),
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
        },

        analytics: {
    monthlySpending,
    monthlyOrders,
    favoriteCategories,
    favoriteBrands,
},
    };

    const purchasedProducts =
    await getPurchasedProducts(userId);


    const categoryMap = {};

for (const item of purchasedProducts) {
  const category = item.product.category;

  if (!category) continue;

  if (!categoryMap[category.id]) {
    categoryMap[category.id] = {
      id: category.id,
      name: category.name,
      total: 0,
    };
  }

  categoryMap[category.id].total += item.quantity;
}

const favoriteCategories = Object.values(categoryMap)
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);

  const brandMap = {};

for (const item of purchasedProducts) {
  const brand = item.product.brand;

  if (!brand) continue;

  if (!brandMap[brand.id]) {
    brandMap[brand.id] = {
      id: brand.id,
      name: brand.name,
      total: 0,
    };
  }

  brandMap[brand.id].total += item.quantity;
}

const favoriteBrands = Object.values(brandMap)
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);

}