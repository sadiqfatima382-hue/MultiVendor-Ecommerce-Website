import { createInvoice, findInvoiceById, findInvoiceByOrderId, } from "../repositories/invoice.repository.js";
import { findOrderById, } from "../repositories/order.repository.js";

function generateInvoiceNumber() {
  return `INV-${Date.now()}`;
}

export async function createInvoiceService(orderId) {
  const order = await findOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.status !== "DELIVERED") {
    throw new Error(
      "Invoice can only be generated for delivered orders."
    );
  }

  const existingInvoice = await findInvoiceByOrderId(orderId);

  if (existingInvoice) {
    throw new Error(
      "Invoice already exists for this order."
    );
  }

  return await createInvoice({
    invoiceNumber: generateInvoiceNumber(),

    orderId,

    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    tax: order.tax,
    grandTotal: order.grandTotal,

    status: "ISSUED",
  });
}

export async function getInvoiceByIdService(id) {
  const invoice = await findInvoiceById(id);

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  return invoice;
}

export async function getInvoiceByOrderService(orderId) {
  const invoice = await findInvoiceByOrderId(orderId);

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  return invoice;
}