# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}
```

Данные по заказу

```
interface IOrder {
  total: number;
  payment: string;
  address: string;
  email: string; 
  phone: string; 
  items: string[];
}
```

Интерфейс для модели данных товаров

```
interface IProductsList {
  items: IProduct[];
}
```

Интерфейс для внутреннего состояния приложения

```
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
```

Интерфейс для данных по заказу

```
export interface IOrderInfo {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
```

Тип описывающий ошибки введенных данных в форму

```
export type TFormErrors = Partial<Record<keyof IOrderInfo, string>>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данных;
- презентер, отвечает за связь представления данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. 
`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).
Методы:
- `get` - выполняет `GET` запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове;
- `handleResponse` - обрабатывает запрос и возвращает промис с данными.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обрабо тки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие;
- `emit` - инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Слой данных 

#### Абстрактный класс Model
Класс отвечает за хранение и логику работы с данными.\
- constructor(data: Partial<T>, protected events: IEvents)- конструктор класса принимает данные для хранения и эвент эмиттер;
- emitChanges(event: string, payload?: object) - вызывает эвент.

#### Класс AppState
Класс отвечает за состояние приложения.\
В полях класса хранятся следующие данные:
- products: IProduct[] - массив со всеми товарами;
- basket: IProduct[] - массив товаров в корзине;
- order: IOrder - заказ пользователя;
- errorForm: TFormErrors - объект с ошибками форм;
Методы:
- addProduct(product: IProduct): void - добавление товаров в корзину;
- deleteProduct(productId: string): void - удаление товаров из корзины;
- clearBasket(): void - полная очистка корзины;
- getTotalProducts(): number - общее количество товаров в корзине;
- getTotalPrice(): number - сумма цен всех товаров в корзине;
- setIdItems(): void - добавление ID товаров в корзине для заказа;
- setOrderInfo(order: keyof IOrderInfo, value: string): void - заполенение полей данными пользователя при оформлении заказа;
- validateInfo(): boolean - валидация формы для модальных окон с данными пользователя;
- validateOrder(): boolean - валидация формы для модального окна заказа;
- clearOrder(): boolean - очистка формы заказа после покупки товаров;
- setOrderField(field: keyof IOrderInfo, value: string): void - забор данных с сервера;
- resetSelected(): void - обновление сосотояния товаров после совершения покупки.

### Слой представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Абстрактный класс Component
Имеет конструктор, который принимает родительский элемент. \
`protected constructor(protected readonly container: HTMLElement)`\
Методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean): void - переключатель класса;
- protected setText(element: HTMLElement, value: string): void - установка текстового содержимого;
- setDisabled(element: HTMLElement, state: boolean): void - смена статуса блокировки;
- protected setHidden(element: HTMLElement): void - скрытие элемента;
- protected setVisible(element: HTMLElement): void - отображение элемента;
- protected setImage(el: HTMLImageElement, src: string, alt?: string): void - установка изображение с альтернативным текстом;
- render(data?: Partial<T>): HTMLElement - возвращает корневой DOM-элемент.

#### Класс Page
Дочерний класс класса Component. Описывает главную страницу.\
Ссылки на внутренние элементы:
- protected _counter: HTMLElement; 
- protected _items: HTMLElement;
- protected _wrapper: HTMLElement;
- protected _basket: HTMLElement.

Конструктор принимает родительский элемент и обработчик событий: \
`constructor(container: HTMLElement, protected events: IEvents)`.
Методы:
- set counter(value: number) - сеттер для счетчика товаров в корзине;
- set items(items: HTMLElement[]) - сеттер для карточек товаров на странице;
- set locked(value: boolean) - сеттер для блока прокрутки.

#### Класс Product
Дочерний класс класса Component. Описывает карточку товара.\
Ссылки на внутренние элементы:
- protected _title: HTMLElement;
- protected _image: HTMLImageElement;
- protected _category: HTMLElement;
- protected _price: HTMLElement;
- protected _button: HTMLButtonElement.

Конструктор принимает имя блока, родительский контейнер и объект с колбэк функциями:
`constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)`.
Методы:
- set id(value: string) - сеттер для уникального ID;
- get id(): string - геттер для уникального ID;
- set title(value: string) - сеттер для названия;
- get title(): string - геттер для названия;
- set image(value: string) - сеттер для кратинки;
- set selected(value: boolean) - сеттер для отображения выбранного товара;
- set price(value: number | null) - сеттер для цены;
- set category(value: CategoryType) - для категории;

#### Класс Basket
Дочерний класс класса Component. Описывает корзину товаров.\
Ссылки на внутренние элементы:
- protected _list: HTMLElement;
- protected _price: HTMLElement;
- protected _button: HTMLButtonElement.

Конструктор принимает имя блока, родительский элемент и обработчик событий:
`constructor(protected blockName: string, container: HTMLElement, protected events: EventEmitter)`\
Методы:
- set price(price: number) - сеттер для общей цены;
- set list(items: HTMLElement[]) - сеттер для списка товаров;
- disableButton(): void - отключение кнопки "Оформить", если корзина пуста;
- refreshIndices(): void - обновление индексов таблицы при удалении товара из корзины.

#### Класс Order
Дочерний класс класса Component. Класс описывает модальное окно заказа.
Ссылки на внутренние элементы:
- protected _card: HTMLButtonElement;
- protected _cash: HTMLButtonElement.

Конструктор принимает имя блока, родительский элемент и обработчик событий:
`constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents)` \
Метод:
- disableButtons(): void - отключение подсвечивания кнопок.

#### Класс Contacts
Дочерний класс класса Component. Класс описывает модальное окно для ввода контактов пользователя.\
Класс содержит конструктор, который принимает родительский элемент и обработчик событий:\
`constructor(container: HTMLFormElement, events: IEvents)`

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов

Код, описывающий взаимодействия представления и данных между собой находится в файле `index.ts`, выполняющий роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчика этих событий, описанных в `index.ts`.\
В `index.ts` сначала создается экземпляры всех необходимых классов, а затем настраивается обработка событий. 

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `products:changed` - изменения массива карточек товара;
- `product:selected` - изменение открываемой в модальном окне информации о товаре.

*Событие, возникающее при взаимодействии пользователя с интерфейсом (генерируется классами, отвечающим за представление)*
- `productAdd:submit` - событие, генерируемое при добавлении товара в корзину, изменение состояния товара и обновление счетчика на корзине; 
- `basket:open` - открыть корзину с товарами;
- `orderInfo:open` - открытие модального окна с информацией по заказу;
- `product:delete` - выбор товара для удаления из корзины;
- `orderDate:input` - изменение данных в форме с данными пользователя по заказу;
- `orderDate:submit` - сохранение данных по заказу;
- `order:submit` - отправка заказа;
- `orderDate:validation` - событие, сообщающее о необходимости валидации формы заказа;
- `contactsDate:validation` - событие, сообщающее о необходимости валидации формы с контактами;
- `orderDate:previewClear` - необходима очистка данных выбранной для показа в модальном окне карточки товара;
- `order:success` - заказ оформлен успешно;
- `modal:close` - закрытие модального окна.