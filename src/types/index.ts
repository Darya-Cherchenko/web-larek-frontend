import { Product } from "../components/AppData";

export interface IProductsList {
  items: IProduct[];
}

export interface IProduct {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
  selected: boolean;
}

export type TProduct = {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}


export interface IOrder {
  total: number;
  payment: string;
  address: string;
  email: string; 
  phone: string; 
  items: string[];
}

export interface IAppState {
  products: Product[];
  basket: Product[];
  order: IOrder;
  errorForm: TFormErrors;
  addProduct(product: Product): void;
  deleteProduct(productId: string): void;
  clearBasket(): void;
  getTotalProducts(): number;
  getTotalPrice(): number;
  setIdItems(): void;
  setOrderField(order: keyof IOrderInfo, value: string): void;
  setContactsField(contacts: keyof IOrderInfo, value: string): void;
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

export interface IOrderResult{
  id: string;
}

export interface IBid {
  price: number|null;
}

export type TFormErrors = Partial<Record<keyof IOrderInfo, string>>;

export type TCategory = 'софт-скил'|'другое'|'дополнительное'|'кнопка'|'хард-скил';

export type TCategoryMapping = {[Key in TCategory]:string};