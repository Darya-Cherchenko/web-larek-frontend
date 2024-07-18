export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: string;
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
  products: IProduct[];
  preview: string | null;
  addProducts(product: IProduct): void;
  deleteProducts(productId: string, payload: Function | null): void;
  getProducts(productId: string): IProduct;
  updateProducts(product: IProduct, payload: Function | null): void;
  checkValidation(data: Record<keyof TShop, string>): boolean;
}

export interface IUserData {
  products: IProduct[];
  preview: string | null;
  addProducts(product: IProduct): void;
  deleteProducts(productId: string, payload: Function | null): void;
  getProducts(productId: string): IProduct;
  updateProducts(product: IProduct, payload: Function | null): void;
  checkValidation(data: Record<keyof TShop, string>): boolean;
}


export type TPaymentInfo = Pick<IOrder, 'payment' | 'address'>;

export type TUserInfo = Pick<IOrder, 'email' | 'phone'>;

export type TShop = Pick<IOrder, 'total' | 'items'>;
//  checkValidation(data: Record<keyof TUserInfo, string>): boolean;