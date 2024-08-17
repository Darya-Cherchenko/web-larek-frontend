import { IOrder, IProduct, TFormErrors, IAppState, IOrderInfo } from "../types";
import { Model } from "./base/model";

export type Store = {
  store: Product[];
}

export class Product extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

export class AppState extends Model<IAppState> {
  products: IProduct[];
  basket: Product[] = [];
  order: IOrder = {
    total: null,
    payment: '',
    address: '',
    email: '', 
    phone: '', 
    items: []
  };

  preview: string | null;
  formErrors: TFormErrors = {};

  addProduct(product: Product) {
    this.basket.push(product);
  }

  deleteProduct(productId: string) {
    this.basket = this.basket.filter(item => item.id !== productId);
  }

  clearBasket() {
    this.basket.length = 0;
  }

  getTotalProducts() {
    return this.basket.length;
  }

  getTotalPrice() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  setIdItems() {
    this.order.items = this.basket.map(item => item.id);
  }

  setOrderField(field: keyof IOrderInfo, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }

    if (this.validateInfo()) {
      this.events.emit('contacts:ready', this.order);
    }
  }

  setContactsField(field: keyof IOrderInfo, value: string) {
    this.order[field] = value;

    if (this.validateInfo()) {
      this.events.emit('contacts:ready', this.order);
    }
  }
  
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('orderDate:validation', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateInfo(){
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsDate:validation', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearOrder(){
    this.order = {
      total: null,
      payment: '',
      address: '',
      email: '', 
      phone: '', 
      items: []
    }
  }

  setProducts(items: IProduct[]){
    this.products = items;
    this.events.emit('products:changed');
  }

  resetSelected(){
    this.products.forEach( item => item.selected = false);
  }
}