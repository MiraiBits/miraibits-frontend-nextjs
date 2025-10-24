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
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type Order = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number; // unit price at time of order
  }>;
  total: number;
  proofFilename?: string;
  proofData?: string; // base64 encoded proof
  proofMimeType?: string; // mime type of proof
};
