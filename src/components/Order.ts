import { Form } from "./common/Form";
import { IEvents } from "./base/events";
import { IOrderInfo } from "../types";
import { Component } from "./base/component";

export class Order extends Form<IOrderInfo> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLFormElement, events: IEvents){
    super(container, events);

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this._card) {
      this._card.addEventListener('click', () =>{
        this.toggleCard(true);
        this.toggleCash(false);
        this.onInputChange('payment', 'card');
      });
    }

    if (this._cash) {
      this._cash.addEventListener('click', () =>{
        this.toggleCash(true);
        this.toggleCard(false);
        this.onInputChange('payment', 'cash');
      });
    }
  }

  toggleCard(state: boolean) {
    this.toggleClass(this._card, 'button_alt-active', state);
  }

  toggleCash(state: boolean) {
    this.toggleClass(this._cash, 'button_alt-active', state);
  } 

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  disableButtons(state: boolean = false) {
    this.toggleClass(this._card, 'button_alt-active', state);
    this.toggleClass(this._cash, 'button_alt-active', state);
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