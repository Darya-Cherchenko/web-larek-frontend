import { Form } from "./common/Form";
import { IEvents } from "./base/events";
import { IOrderInfo } from "../types";

export class Order extends Form<IOrderInfo> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLFormElement, events: IEvents){
    super(container, events);

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this._card) {
      this._card.addEventListener('click', () =>{
        this._card.classList.add('button_alt-active');
        this._cash.classList.remove('button_alt-active');
        this.onInputChange('payment', 'card');
      });
    }

    if (this._cash) {
      this._cash.addEventListener('click', () =>{
        this._cash.classList.add('button_alt-active');
        this._card.classList.remove('button_alt-active');
        this.onInputChange('payment', 'cash');
      });
    }
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  disableButtons() {
    this._card.classList.remove('button_alt-active');
    this._cash.classList.remove('button_alt-active');
  }
}

export class Contacts extends Form<IOrderInfo> {
  constructor(container: HTMLFormElement, protected events: IEvents){
    super(container, events);
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }
}