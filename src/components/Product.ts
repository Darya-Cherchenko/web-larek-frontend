import { Component } from "./base/component";
import { ensureElement, formatNumber } from "../utils/utils";
import { categoryMapping } from "../utils/constants";
import { TCategory } from "../types";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
      this._price = container.querySelector(`.${blockName}__price`);
      this._button = container.querySelector(`.${blockName}__button`);
      this._category = container.querySelector(`.${blockName}__category`);

      if (actions?.onClick) {
          if (this._button) {
              this._button.addEventListener('click', actions.onClick);
          } else {
              container.addEventListener('click', actions.onClick);
          }
      }
  }

  set id(value: string) {
      this.container.dataset.id = value;
  }

  get id(): string {
      return this.container.dataset.id || '';
  }

  set title(value: string) {
      this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent || '';
  }

  set image(value: string) {
      this.setImage(this._image, value, this.title);
  }

  set selected(value: boolean) {
    if (!this._button.disabled) {
      this.setDisabled(this._button, value)
    }
  }

  set price(value: number | null) {
    this.setText(this._price, value ? formatNumber(value) + ' синапсов' : 'Бесценно');
    if (this._button && !value) {
      this.setDisabled(this._button, true);
    }
  }

  set category(value: TCategory) {
    this.setText(this._category, value);
    this._category.classList.add(categoryMapping[value]);
  }
}

export class ProductItem extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
      super('card', container, actions);
  }
}

export class ProductItemPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
      super('card', container, actions);
      this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }
}