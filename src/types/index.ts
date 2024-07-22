export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrder {
  id: string;
  total: number;
  payment: string;
  address: string;
  email: string; 
  phone: string; 
  items: IProduct[];
}

export interface IProductsList {
  total: number;
  items: IProduct[];
}

export interface IProductsData {
  products: IProduct[];
  preview: string | null;
  addProduct(product: IProduct): void;
  deleteProduct(productId: string): void;
  getProducts(): IProduct[];
  checkProductsValidation(data: Record<keyof TShop, string>): boolean;
}

export interface IOrderData {
  setOrderInfo(orderData: IOrder): void;
  checkOrderValidation(data: Record<keyof TOrderInfo, string>): boolean;
}

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'| 'email' | 'phone'>;

export type TShop = Pick<IOrder, 'total' | 'items'>;