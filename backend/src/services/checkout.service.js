import { findCheckoutCart, } from "../repositories/checkout.repository.js";
import { findDefaultAddress, findAddressByIdAndUser, } from "../repositories/address.repository.js";
import { calculateCartSummary, groupItemsByVendor, } from "../utils/pricing.js";

async function validateCartItems(cartItems) {
  for (const item of cartItems) {
    const variant = item.productVariant;

    if (!variant) {
      throw new Error("Product variant not found.");
    }

    const product = variant.product;

    if (!product) {
      throw new Error("Product not found.");
    }

    // Product status
    if (product.status !== "ACTIVE") {
      throw new Error(
        `${product.name} is currently unavailable.`
      );
    }

    // Variant status (if your schema has it)
    if (
      variant.status &&
      variant.status !== "ACTIVE"
    ) {
      throw new Error(
        `${product.name} variant is unavailable.`
      );
    }

    // Stock check
    if (variant.stock < item.quantity) {
      throw new Error(
        `Only ${variant.stock} units of ${product.name} are available.`
      );
    }
  }
}

export async function getCheckoutSummaryService(
  userId,
  addressId
) {
  const cart = await findCheckoutCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  await validateCartItems(cart.items);

  let address;

  if (addressId) {
    address = await findAddressByIdAndUser(
      addressId,
      userId
    );
  } else {
    address = await findDefaultAddress(userId);
  }

  if (!address) {
    throw new Error("Shipping address not found.");
  }

  const vendors = groupItemsByVendor(cart.items);

  const summary = calculateCartSummary(cart.items);

  return {
    address,
    vendors,
    summary,
    customer: {
    id: userId
}
  };
}
export async function validateCheckoutService(
  userId,
  addressId
) {
  await getCheckoutSummaryService(
    userId,
    addressId
  );

  return {
    valid: true,
    message: "Checkout validated successfully.",
  };
}