import { IApi, Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { AppApi } from './components/model/AppApi';
import { OrderData } from './components/model/OrderData';
import { ProductsData } from './components/model/ProductsData';
import { Header } from './components/view/Header';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { CardsContainer } from './components/view/CardsContainer';
import './scss/styles.scss';
import { API_URL, constraintsContacts, constraintsOrder, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { Form } from './components/common/Form';
import { OrderForm } from './components/view/OrderForm';
import { IContacts, TOrderInfo } from './types/components/model/ProductApi';
import { OrderSuccess } from './components/view/OrderSuccess';

const templates: Record<string, HTMLTemplateElement> = {
    cardCatalog: document.querySelector('#card-catalog'),
    cardPreview: document.querySelector('#card-preview'),
    cardCompact: document.querySelector('#card-basket'),
    basket: document.querySelector('#basket'),
    order: document.querySelector('#order'),
    contacts: document.querySelector('#contacts'),
    success: document.querySelector('#success'),
}

// EventEmitter
const events = new EventEmitter();

// Инициализация Api
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

// Инициализация моделей данных
const productsData = new ProductsData(events);
const orderData = new OrderData(events);

// Инициализация классов представления
const header = new Header(document.querySelector('.header'), settings.header, events)
const cardsContainer = new CardsContainer(document.querySelector(settings.elements.cardsContainer));
const modal = new Modal(document.querySelector(settings.elements.modal), settings.modal, events);
const basket = new Basket(cloneTemplate(templates.basket), settings.basket, events);
const orderForm = new OrderForm(cloneTemplate(templates.order), settings.form, events, () => {events.emit('order:submit')});
const contactsForm = new Form(cloneTemplate(templates.contacts), settings.form, events, () => {events.emit('contacts:submit')});
const success = new OrderSuccess(cloneTemplate(templates.success), settings.orderSuccess, events)



// изначальная загрузка данных
api.getProducts().then(response => {
    productsData.items = response.items;
})
.catch(res => console.log(res))



// Ивенты EventEmitter

// выбор карточки для просмотра в модалке
events.on('product:select', (evt: {product: string}) => {
    const data = productsData.getProduct(evt.product);

    const isDisabled = orderData.items.indexOf(data) !== -1 || data.price === null;
    console.log(isDisabled)

    const card = new Card(cloneTemplate(templates.cardPreview), settings.cardPreview, events, handleAddCard, isDisabled);

    modal.content = card.render(data);
    modal.open();
})

// открытие корзины
events.on('basket:open', () => {
    modal.content = basket.render(collectCatalog());

    modal.open();
})

// добавление карточки в корзину
events.on('item:select', (evt: {product: string}) => {
    orderData.addItem(productsData.getProduct(evt.product));

    modal.close();
})

// удаление карточки из корзины
events.on('item:delete', (evt: {product: string}) => {
    orderData.deleteItem(evt.product);

    basket.render(collectCatalog());
})

// подтверждение данных о товарах в корзине
events.on('basket:submit', () => {
    modal.content = orderForm.render();
})

// подтверждение данных о заказе
events.on('order:submit', () => {
    orderData.orderInfo = orderForm.getInputValues();
    modal.content = contactsForm.render();
})

// подтверждение данных о контактах пользователя
events.on('contacts:submit', () => {
    orderData.orderInfo = contactsForm.getInputValues();

    api.pushOrder(orderData.order)
    .then(result => {
        orderData.clear();
        orderForm.clear();
        contactsForm.clear();
        success.total = result.total;
        modal.content = success.render();
    })
    .catch(error => {
        console.log(error);
    })
})

// изменение данных формы заказа
events.on('order:input', (data: Record<keyof TOrderInfo | keyof IContacts, string>) => {
    const result = orderData.checkFormValidation(data, constraintsOrder);

    events.emit('order:validated', {isValid: !result, result: result});
})

// изменение данных о контактах пользователя
events.on('contacts:input', (data: Record<keyof TOrderInfo | keyof IContacts, string>) => {
    const result = orderData.checkFormValidation(data, constraintsContacts);

    events.emit('contacts:validated', {isValid: !result, result: result});
})

// изменение способа оплаты
events.on('order:payment:changed', (data: Record<string, string>) => {
    modal.content = orderForm.render(data);
})

// обработка формы заказа после валидации
events.on('order:validated', (data: {isValid: boolean, result: {}}) => {
    orderForm.setValid(data.isValid);
    orderForm.setErrors(data.result);

    orderForm.render();
})

// обработка формы контактов после валидации
events.on('contacts:validated', (data: {isValid: boolean, result: {}}) => {
    contactsForm.setValid(data.isValid);
    contactsForm.setErrors(data.result);

    contactsForm.render();
})

// нажатие на кнопку в окне успешного офрмления
events.on('order:completed', () => {
    modal.close();
})

// изменения в корзине
events.on('items:changed', () => {
    refreshHeaderCounter();
})

// изменения в коталоге товаров
events.on('products:changed', () => {
    cardsContainer.render({catalog: productsData.items.map(data => {
        const card = new Card(cloneTemplate(templates.cardCatalog), settings.cardCatalog, events);
        return card.render(data);
    })});
});



// используемые функции
function refreshHeaderCounter() {
    header.counter = orderData.items.length;
}

// собирает данные для компонента отображения корзины
function collectCatalog() {
    return {
        catalog: orderData.items.map(data => {
            const card = new Card(cloneTemplate(templates.cardCompact), settings.cardCompact, events, handleDeleteCard);
            return card.render(data);
        }),
        total: orderData.total
    }
}

// удаление и добавление карточки
export function handleAddCard() {
    this.events.emit('item:select', {product: this.cardId});
}

export function handleDeleteCard() {
    this.events.emit('item:delete', {product: this.cardId});
}