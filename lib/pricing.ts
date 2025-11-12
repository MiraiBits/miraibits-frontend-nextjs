type QuantityItem = { quantity: number };

export const FLAT_SHIPPING_FEE_LKR = 400;

export function calculateShippingFee(itemCount: number): number {
  return itemCount > 0 ? FLAT_SHIPPING_FEE_LKR : 0;
}

export function calculateShippingFeeForItems(items: QuantityItem[]): number {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  return calculateShippingFee(totalQuantity);
}
