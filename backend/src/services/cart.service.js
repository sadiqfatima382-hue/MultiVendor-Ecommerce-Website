import { findCartByUserId, createCart, findCartItem, createCartItem, updateCartItem, findProductVariantById, getCart,  findCartItemById, deleteCartItem ,clearCart} from "../repositories/cart.repository.js";

export async function addToCartService(userId, data) {
  const { productVariantId, quantity } = data;

  // 1. Check product variant
  const productVariant = await findProductVariantById(productVariantId);

  if (!productVariant) {
    throw new Error("Product variant not found.");
  }

  // 2. Stock validation
  if (productVariant.stock <= 0) {
    throw new Error("Product is out of stock.");
  }

  if (quantity > productVariant.stock) {
    throw new Error(
      `Only ${productVariant.stock} items available in stock.`
    );
  }

  // 3. Find user's cart
  let cart = await findCartByUserId(userId);

  // 4. Create cart if it doesn't exist
  if (!cart) {
    cart = await createCart(userId);
  }

  // 5. Check if product already exists in cart
  const existingItem = await findCartItem(
    cart.id,
    productVariantId
  );

  // 6. Increase quantity
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > productVariant.stock) {
      throw new Error(
        `Only ${productVariant.stock} items available in stock.`
      );
    }

    return updateCartItem(existingItem.id, {
      quantity: newQuantity,
    });
  }

  // 7. Create new cart item
  return createCartItem({
    cartId: cart.id,
    productVariantId,

    quantity,

    // Price snapshot
    price: productVariant.price,
  });
}


export async function getCartService(userId) {
  // Find user's cart
  const cart = await findCartByUserId(userId);

  // User has never created a cart
  if (!cart) {
    return {
      items: [],
      summary: {
        totalItems: 0,
        totalQuantity: 0,
        totalAmount: 0,
      },
    };
  }

  // Get complete cart with product details
  const completeCart = await getCart(cart.id);

  let totalItems = 0;
  let totalQuantity = 0;
  let totalAmount = 0;

  const items = completeCart.items.map((item) => {
    const subtotal =
      Number(item.price) * item.quantity;

    totalItems++;

    totalQuantity += item.quantity;

    totalAmount += subtotal;

    return {
      ...item,
      subtotal,
    };
  });

  return {
    id: completeCart.id,
    items,
    summary: {
      totalItems,
      totalQuantity,
      totalAmount,
    },
  };
}

export async function updateCartItemService(
  userId,
  itemId,
  data
) {
  const { quantity } = data;

  // Find user's cart
  const cart = await findCartByUserId(userId);

  if (!cart) {
    throw new Error("Cart not found.");
  }

  // Find cart item
  const cartItem = await findCartItemById(itemId);

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }

  // Security check
  if (cartItem.cartId !== cart.id) {
    throw new Error(
      "You are not authorized to update this cart item."
    );
  }

  // Stock validation
  if (quantity > cartItem.productVariant.stock) {
    throw new Error(
      `Only ${cartItem.productVariant.stock} items available in stock.`
    );
  }

  // Update quantity
  await updateCartItem(itemId, {
    quantity,
  });

  // Return updated cart
  return getCartService(userId);
}

export async function removeCartItemService(userId,itemId) {
  const cart = await findCartByUserId(userId);
  if(!cart){
    throw new Error("Cart not found")
    
  }

  const cartItem = await findCartItemById(itemId)
  if(!cartItem){
    throw new Error("Cart Items not found")
  }
  
   if (cartItem.cartId !== cart.id) {
    throw new Error(
      "You are not authorized to remove this cart item."
    );
  }

  await deleteCartItem(itemId);

  return getCartService(userId);
}

export async function clearCartService(userId) {
  const cart = await findCartByUserId(userId);

  if (!cart) {
    return {
      items: [],
      summary: {
        totalItems: 0,
        totalQuantity: 0,
        totalAmount: 0,
      },
    };
  }

  await clearCart(cart.id);

  return {
    items: [],
    summary: {
      totalItems: 0,
      totalQuantity: 0,
      totalAmount: 0,
    },
  };
}