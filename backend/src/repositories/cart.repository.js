import prisma from "../config/prisma.js";

//    Cart
// Find user's cart
export async function findCartByUserId(userId) {
    return prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: true,
        },
    });
}

// Create cart
export async function createCart(userId) {
    return prisma.cart.create({
        data: {
            userId,
        },
    });
}

//    Cart Items 
// Find cart item
export async function findCartItem(cartId, productVariantId) {
    return prisma.cartItem.findUnique({
        where: {
            cartId_productVariantId: {
                cartId,
                productVariantId,
            },
        },
    });
}

// Create cart item
export async function createCartItem(data) {
    return prisma.cartItem.create({
        data,
    });
}

// Update cart item quantity
export async function updateCartItem(id, data) {
    return prisma.cartItem.update({
        where: {
            id,
        },
        data,
    });
}

// Delete cart item
export async function deleteCartItem(id) {
    return prisma.cartItem.delete({
        where: {
            id,
        },
    });
}

// Delete all cart items
export async function clearCart(cartId) {
    return prisma.cartItem.deleteMany({
        where: {
            cartId,
        },
    });
}

// Find cart item by ID
export async function findCartItemById(id) {
  return prisma.cartItem.findUnique({
    where: {
      id,
    },
    include: {
      cart: true,
      productVariant: true,
    },
  });
}
// Find Product Variant
export async function findProductVariantById(id) {
    return prisma.productVariant.findUnique({
        where: {
            id,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    vendorId: true,
                },
            },
        },
    });
}
export async function getCart(cartId) {
    return prisma.cart.findUnique({
        where: {
            id: cartId,
        },
        include: {
            items: {
                include: {
                    productVariant: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    // thumbnail: true,
                                },
                            },

                            color: true,
                            size: true,
                            weight: true,
                        },
                    },
                },
            },
        },
    });
}