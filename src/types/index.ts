export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

export interface IOrder {
  total: number;
  payment: string;
  address: string;
  email: string; 
  phone: string; 
  items: IProduct[];
}

export interface IProductsList {
  items: IProduct[];
}

export interface IAppState {
  products: IProduct[];
  basket: IProduct[];
  order: IOrder;
  errorForm: TFormErrors;
  addProduct(product: IProduct): void;
  deleteProduct(productId: string): void;
  clearBasket(): void;
  getTotalProducts(): number;
  getTotalPrice(): number;
  setIdItems(): void;
  setOrderInfo(order: keyof IOrderInfo, value: string): void;
  validateInfo(): boolean;
  validateOrder(): boolean;
  clearOrder(): boolean;
  setProducts(items: IProduct[]): void;
  resetSelected(): void;
}

export interface IOrderInfo {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export type TFormErrors = Partial<Record<keyof IOrderInfo, string>>;