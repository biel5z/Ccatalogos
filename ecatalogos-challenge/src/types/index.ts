export interface ProductImage {
  id: number;
  path: string;
  order: number;
}

export interface ProductSku {
  id: number;
  size: string;
  stock: number;
  price: string;
  code: number;
  minQuantity: number;
  multipleQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  reference: string;
  hexCode: string | null;
  type: string;
  gender: string;
  promptDelivery: boolean;
  description: string | null;
  categories: string;
  subcategories: string | null;
  images: ProductImage[];
  skus: ProductSku[];
}

export interface CartItem {
  productReference: string;
  packs: number;
}