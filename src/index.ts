import './scss/styles.scss';

import { StoreAPI } from './components/StoreApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppState, Product, Store } from './components/AppData';
import { Page } from './components/Page';
import { ProductItem, ProductItemPreview } from './components/Product';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket, ProductItemBasket } from './components/Basket';
import { IOrderInfo } from './types';
import { Contacts, Order } from './components/Order';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new StoreAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
    onClick: () => {
      events.emit('modal:close');
      modal.close();
    }
});

// Получаем товары с сервера
api.getProductList()
    .then(appData.setProducts.bind(appData))
    .catch((err) => {
      console.error(err);
});

// Изменились элементы каталога
events.on<Store>('products:changed', () => {
    page.products = appData.products.map(item => {
        const card = new ProductItem(cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('product:selected', item)
        });
        return card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });
});

// Открыть карточку товара
events.on('product:selected', (item: Product) => {
    page.locked = true;
    const product = new ProductItemPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        events.emit('productAdd:submit', item)
    },
  });
  modal.render({
    content: product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      selected: item.selected
    }),
  });
});

// Добавление товара в корзину
events.on('productAdd:submit', (item: Product) => {
    item.selected = true;
    appData.addProduct(item);
    page.counter = appData.getTotalProducts();
    modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
    page.locked = true;
    const itemsInBasket = appData.basket.map((item, index) => {
      const ProductsItems = new ProductItemBasket('card', cloneTemplate(cardBasketTemplate),
    {
      onClick: () => events.emit('product:delete', item)
    });
    return ProductsItems.render({
      title: item.title,
      price: item.price,
      index: index + 1
    });
  });
  modal.render({
    content: basket.render({
      items: itemsInBasket,
      price: appData.getTotalPrice()
    }),
  });
});

// Удалить товар из корзины
events.on('product:delete', (item: Product) => {
    item.selected = false;
    appData.deleteProduct(item.id);
    basket.price = appData.getTotalPrice();
    page.counter = appData.getTotalProducts();
    basket.refreshIndices();
    if (!appData.basket.length) {
      basket.disabledButton();
    }
});

// Открыть форму для оформления заказа (способ оплаты и адрес)
events.on('orderInfo:open', () => {
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть форму для оформления заказа (почта и телефон)
events.on('order:submit', () => {
    appData.order.total = appData.getTotalPrice();
    appData.setIdItems();
    modal.render({
        content: contacts.render({
            valid: false,
            errors: []
        })
    });
});

// Изменилось состояние валидации формы для способа оплаты и адреса
events.on('orderDate:validation', (errors: Partial<IOrderInfo>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы для телефона и почты
events.on('contactsDate:validation', (errors: Partial<IOrderInfo>) => {
    const { phone, email } = errors;
    contacts.valid = !phone && !email;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей (адрес и способ оплаты)
events.on(/^order\..*:change/, (data: { field: keyof IOrderInfo, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Изменилось одно из полей (контакты)
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderInfo, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.post('/order', appData.order)
        .then((result) => {
          events.emit('order:success', result);
          appData.clearBasket();
          appData.clearOrder();
          order.disableButtons();
          page.counter = 0;
          appData.resetSelected();
        })
        .catch(err => {
            console.error(err);
        });
});

// Открытие окна успешного оформления заказа
events.on('order:success', (res: ApiListResponse<string>) => {
    modal.render({
        content: success.render({
            description: res.total
        })
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});