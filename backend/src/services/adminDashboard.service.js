import{countUsers, countVendors, countProducts, countLowStockProducts, countOutOfStockProducts} from"../repositories/adminDashboard.repository.js"

export async function getAdminDashboardService() {
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

] = await Promise.all([

    // Users
    countUsers(),

    countUsers({
        role: {
            name: "CUSTOMER",
        },
    }),

    countUsers({
        role: {
            name: "EMPLOYEE",
        },
    }),

    countUsers({
        role: {
            name: "SUPER_ADMIN",
        },
    }),

    // Vendors
    countVendors(),

    countVendors({
        status: "PENDING",
    }),

    countVendors({
        status: "APPROVED",
    }),

    countVendors({
        status: "REJECTED",
    }),

    // Products
    countProducts(),

    countProducts({
        status: "DRAFT",
    }),

    countProducts({
        status: "PENDING_APPROVAL",
    }),

    countProducts({
        status: "ACTIVE",
    }),

    countProducts({
        status: "INACTIVE",
    }),

    countProducts({
        status: "REJECTED",
    }),

    countProducts({
        status: "ARCHIVED",
    }),

    countLowStockProducts(),

    countOutOfStockProducts(),

]);

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

};
}