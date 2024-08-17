import { Component } from "./base/component";
import { formatNumber, createElement, ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { IProduct } from "../types";

interface IBasketView {
  items: HTMLElement[];
  price: number | null;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>(`.${blockName}__list`, this.container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, this.container);
    this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, this.container);

    if (this._button) {
      this._button.addEventListener('click', () => {
        this.events.emit('orderInfo:open');
      });
    }
    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
  } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста'
      }));
    }
    this.setDisabled(this._button, items.length ? false : true)
  }

  set price(value: number) {
    this.setText(this._price, formatNumber(value) + ' синапсов');
  }

  disabledButton(){
    this.setDisabled(this._button, true);
  }

  refreshIndices() {
    Array.from(this._list.children).forEach((item, index) => 
      (this.setText(item.querySelector(`.basket__item-index`)!, (index + 1).toString())));
  }
}

interface IBasketProduct extends IProduct {
  id: string;
  index: number;
}

interface IProductItemBasketActions {
  onClick: (event: MouseEvent) => void;
}

export class ProductItemBasket extends Component<IBasketProduct> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, protected action?: IProductItemBasketActions) {
    super(container);

    this._index = ensureElement<HTMLElement>(`.basket__item-index`, this.container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, this.container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, this.container);
    this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, this.container);

    if (this._button) {
      this._button.addEventListener('click', (evt) => {
        this.container.remove();
        action?.onClick(evt);
      });
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set index(value: number) {
    this.setText(this._index, formatNumber(value));
  }

  set price(price: number) {
    this.setText(this._price, formatNumber(price) + ' синапсов');
  }
}