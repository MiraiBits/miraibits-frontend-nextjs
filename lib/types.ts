export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  stock: number;
  specifications?: { [key: string]: string };
  datasheet?: string[];
  category?: string;
  tags?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'reviewing_payment'
  | 'confirmed_payment'
  | 'shipped'
  | 'delivered'
  | 'payment_failed'
  | 'cancelled';

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    productId: string;
    slug?: string;
    quantity: number;
    price: number; // unit price at time of order
  }>;
  total: number;
  proofFilename?: string;
  proofData?: string; // base64 encoded proof
  proofMimeType?: string; // mime type of proof
};
