export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  specifications: Record<string, string | undefined>;
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
    quantity: number;
    price: number; // unit price at time of order
  }>;
  total: number;
  proofFilename?: string;
  proofData?: string; // base64 encoded proof
  proofMimeType?: string; // mime type of proof
};


