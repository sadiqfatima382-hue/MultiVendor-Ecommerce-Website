import { countUsers, countVendors, countProducts, countLowStockProducts, countOutOfStockProducts, countOrders, sumRevenue, sumProductsSold, countCompletedOrders, getRecentOrders, getRecentUsers, getRecentVendors, getTopVendors, getTopSellingProducts, getPendingVendorApprovals } from "../repositories/adminDashboard.repository.js"
import { findVendorById } from "../repositories/vendorDashboard.repository.js";
export async function getAdminDashboardService() {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999)

    const startOfMonth = new Date(today.getFullYear(),
        today.getMonth(), 1,
    )
    const [

        // User Statistics
        totalUsers,
        customers,
        employees,
        superAdmins,

        // Vendor Statistics
        totalVendors,
        pendingVendors,
        approvedVendors,
        rejectedVendors,

        // Product Statistics
        totalProducts,
        draftProducts,
        pendingProducts,
        activeProducts,
        inactiveProducts,
        rejectedProducts,
        archivedProducts,
        lowStock,
        outOfStock,

        // Order Statistics
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,

        // Revenue Statistics
        totalRevenue,
        todayRevenue,
        monthlyRevenue,
        productsSold,
        completedOrders,

        // Dashboard Insights
        recentOrders,
        recentUsers,
        recentVendors,
        pendingVendorApprovals,
        topSellingProducts,
        topVendorStats,

        //Analytics
        monthlyRevenue,
        monthlyOrders,
        monthlyUsers,
        monthlyVendors,
        productStatusDistribution,
        vendorStatusDistribution,

    ] = await Promise.all([

        // Users
        countUsers(),
        countUsers({ role: { name: "CUSTOMER", }, }),
        countUsers({ role: { name: "EMPLOYEE", }, }),
        countUsers({ role: { name: "SUPER_ADMIN", }, }),

        // Vendors
        countVendors(),
        countVendors({ status: "PENDING", }),
        countVendors({ status: "APPROVED", }),
        countVendors({ status: "REJECTED", }),

        // Products
        countProducts(),
        countProducts({ status: "DRAFT", }),
        countProducts({ status: "PENDING_APPROVAL", }),
        countProducts({ status: "ACTIVE", }),
        countProducts({ status: "INACTIVE", }),
        countProducts({ status: "REJECTED", }),
        countProducts({ status: "ARCHIVED", }),
        countLowStockProducts(),
        countOutOfStockProducts(),

        // Order Statistics
        countOrders(),
        countOrders({ status: "PENDING", }),
        countOrders({ status: "PROCESSING", }),
        countOrders({ status: "SHIPPED", }),
        countOrders({ status: "DELIVERED", }),
        countOrders({ status: "CANCELLED", }),

        // Revenue Statistics
        sumRevenue({ status: "DELIVERED", }),
        sumRevenue({ status: "DELIVERED", createdAt: { gte: startOfToday, lte: endOfToday, }, }),
        sumRevenue({ status: "DELIVERED", createdAt: { gte: startOfMonth, }, }),
        sumProductsSold(),
        countCompletedOrders(),

        // Dashboard Insights
        getRecentOrders(),
        getRecentUsers(),
        getRecentVendors(),
        getPendingVendorApprovals(),
        getTopSellingProducts(),
        getTopVendors(),

        //Monthly Data 
        getMonthlyRevenue(currentYear),
        getMonthlyOrders(currentYear),
        getMonthlyUsers(currentYear),
        getMonthlyVendors(currentYear),
        getProductStatusDistribution(),
        getVendorStatusDistribution(),

    ]);

    const topVendors = await Promise.all(
        topVendorStats.map(async (vendor) => {
            const details = await findVendorById(vendor.vendorId);

            return {
                id: details.id,
                businessName: details.businessName,
                slug: details.slug,
                logo: details.logo,
                revenue: Number(vendor._sum.subtotal ?? 0),
            };
        })
    );

    return {

        users: {

            totalUsers,
            customers,
            employees,
            superAdmins,

        },

        vendors: {

            totalVendors,
            pendingVendors,
            approvedVendors,
            rejectedVendors,

        },

        products: {

            totalProducts,
            draftProducts,
            pendingProducts,
            activeProducts,
            inactiveProducts,
            rejectedProducts,
            archivedProducts,
            lowStock,
            outOfStock,

        },

        orders: {
            totalOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
        },

        revenue: {
            totalRevenue,
            todayRevenue,
            monthlyRevenue,
            productsSold,
            completedOrders,
        },

        dashboard: {
            recentOrders,
            recentUsers,
            recentVendors,
            pendingVendorApprovals,
            topSellingProducts,
            topVendors,
        },

        analytics: {
            monthlyRevenue,
            monthlyOrders,
            monthlyUsers,
            monthlyVendors,
            productStatusDistribution,
            vendorStatusDistribution,
        }
    };
}