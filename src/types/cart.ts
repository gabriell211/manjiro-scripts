export type CartItemType = "product" | "consulting";

export type CartItem = {
  id: string;
  type: CartItemType;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutPayloadItem = {
  id: string;
  type: CartItemType;
  quantity: number;
};
