export function calculateCartSummary(items) {
  let totalItems = 0;
  let totalQuantity = 0;
  let subtotal = 0;

  for (const item of items) {
    const quantity = item.quantity;
    const price = Number(item.productVariant.price);

    totalItems++;
    totalQuantity += quantity;
    subtotal += quantity * price;
  }

  const shipping = 0;
  const discount = 0;
  const tax = 0;

  return {
    totalItems,
    totalQuantity,
    subtotal,
    shipping,
    discount,
    tax,
    grandTotal: subtotal + shipping + tax - discount,
  };
}

export function groupItemsByVendor(items) {
  const vendors = {};

  for (const item of items) {
    const vendor = item.productVariant.product.vendor;

    if (!vendors[vendor.id]) {
      vendors[vendor.id] = {
        vendor: {
          id: vendor.id,
          businessName: vendor.businessName,
          slug: vendor.slug,
        },
        items: [],
        subtotal: 0,
      };
    }

    vendors[vendor.id].items.push(item);

    vendors[vendor.id].subtotal +=
      item.quantity * Number(item.productVariant.price);
  }

  return Object.values(vendors);
}