import { Component } from "../base/component";
import { formatNumber, createElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IProduct } from "../../types";

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

    this._list = this.container.querySelector(`.${blockName}__list`);
    this._price = this.container.querySelector(`.${blockName}__price`);
    this._button = this.container.querySelector(`.${blockName}__button`);

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
      (item.querySelector(`.basket__item-index`)!.textContent = (index + 1).toString()));
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

    this._index = this.container.querySelector(`.basket__item-index`);
    this._title = this.container.querySelector(`.${blockName}__title`);
    this._price = this.container.querySelector(`.${blockName}__price`);
    this._button = this.container.querySelector(`.${blockName}__button`);

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