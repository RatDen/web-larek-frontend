# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/ — папка файлов с типами
- src/index.ts — точка входа приложения
- src/common.blocks/ — корневая папка стилей
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

## Данные и типы данных

Товар

```
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

Данные для превью товара

```
export type TProductPreview = Exclude<IProduct, 'description'>;
```

Данные для просмотра в модальном окне

```
export type TProductFull = IProduct;
```

Данные для отображения в корзине

```
export type TProductCompact = Pick<IProduct, 'id' | 'title' | 'price'>;
```

Контакты пользователя

```
export interface IContacts {
    email: string;
    phone: string;
}
```

Заказ

```
export interface IOrder extends IContacts {
    payment: string;
    address: string;
    total: number;
    items: string[];
}
```

Общая информация о заказе

```
export type TOrderFullInfo = Exclude<IOrder, 'items'>
```

Данные о заказе, используемые в модальном окне

```
export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;
```

Результат запроса на сервер при успешном выполнении

```
export interface IOrderResult {
    id: string;
    total: number;
}
```

Интерфейс взаимодейстия с сервером

```
export interface IProductAPI {
    getProducts(): Promise<ApiListResponse<IProduct>>;
    getProduct(id: string): Promise<IProduct>;
    pushOrder(order: IOrder): Promise<IOrderResult>;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечающий за отображение данных,  
- слой данных, отвечающий за хранение и изменение данных,
- презентер, отвечающий за связь представления и данных.

### Базовый Код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы:
- `get` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmmiter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс Используется в презентере для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом описаны интерфейсом 'IEvents':
- 'on' - подписка на событие
- 'emit' - инициализация события
- 'trigger' - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductsData
Класс отвечает за хранение информации и логику работы с данными товаров.\
Конструктор класса принимает инстант брокера событий.

Поля класса:
- _items: IProduct[]; - массив объектов товаров
- _preview: string; - id товара для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменения данных.

Методы класса:
- getProducts(): void; - получает все товары с сервера
- getProduct(id: string): void; - получает 1 товар с сервера
- также геттеры и сеттеры для полей класса

#### Класс OrderData
Класс отвечает за хранение информации и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий.

Поля класса:
- _items: TProductCompact[]; - массив компактных версий объекта товаров
- _orderInfo: TOrderFullInfo; - общая информация о заказе
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменения данных.

Методы класса:
- addItem(id: string, callback: Function | null = null): void; - добавляет товар в корзину. Если передан колбэк, то выполняет его после добавления, если нет, то вызывает событие изменения массива
- deleteItem(id: string, callback: Function | null = null): void; - удаляет товар из корзины. Если передан колбэк, то выполняет его после удаления, если нет, то вызывает событие изменения массива
- checkOrderValidation(data: Record<keyof TOrderInfo, string>): boolean; - проверяет валидность формы для ввода части данных заказа
- checkContactsValidation(data: Record<keyof IContacts, string>): boolean; - проверяет валидность формы для ввода части данных заказа
- pushOrder(callback: Function | null = null): Promise<IOrderResult>; - отправляет заказ на сервер. Если передан колбэк, то выполняет его после отправки, если нет, то вызывает событие оформления заказа
- также геттеры и сеттеры для полей класса

### Слой представления

#### Класс Modal
Реализует модальное окно.\
Наследует поля и методы abstract BaseView и реализует в себе функционал IView.\
Устанавливает слушатели на клавиатуру, для закрытия по нажатию на Esc, на клик в оверлей и кнопку закрытия.
В конструктор передается HTMLElement элемента, настройки с селекторами и инстант брокера событий

Поля класса:
- element: HTMLElement; - DOM элемент модального окна (из интерфейса IView)
- content: IView<HTMLElement>; - элемент помещенный в модальное окно
- closeButton: HTMLButtonElement; - элемент кнопки для закрытия окна
- actions?: IClickable<HTMLElement>[]; - возможные кнопки в окне
- events: IEvents - экземпляр брокера событий

Методы класса:
- методы `render` и `copy` из интерфейса IView
- также предоставляет методы `open` и `close` для управления отображение модального окна.

#### Класс Card
Отвечает за отображение карточки товара на странице сайта и в модальном окне.\
В конструктор передается DOM элемент темплейта, что позволит при необходимости формировать карточки разных вариантов верстки, инстант `EventEmitter` для инициализации событий.\
В классе устанавливается слушатель на клик по карточке (в версии для превью).\
Поля класса содержат элементы разметки карточки.

Методы:
- setData(data: ICard): void; - заполняет атрибуты элементов карточки данными
- геттер id для получения id товара
- render(): HTMLElement; - метод из нтерфейса IView

#### Класс CardContainer
Отвечает за отображение блока с карточками на главной странице.\
В конструктор принимает контейнер, куда помещается разметка карточек.\
Содержит метод `addCard(cardElement: HTMLElement): void` для добавления карточек в разметку.\

#### Класс Basket
Отвечает за отображение корзины с добавленными товарами.\
В конструктор передается темплейт с разметкой.\
Поля класса содержат элементы разметки корзины, в частности элемент списка карточек товаров.\
Имеет метод сеттер для итоговой суммы покупки и render для отрисовки.

#### Класс Form
Отвечает за отображение формы заполнения данных.\
Конструктор принимает темплейт разметки (из-за чего можно переиспользовать для разных форм), информацию для заполнения и инстант `EventEmitter` для инициализации событий.\
Поля хранят в себе имя формы, элементы разметки формы (в том числе инпуты и элементы вывода ошибок).\

Методы:
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные, введенные пользователем
- setError(data: {field: string, value: string, validInformation: string}): void - принимает объект с данными для отображения или сокрытия текстов ошибок в поле для ошибок
- методы `showInputError` и `hideInputError` для отображения и сокрытия текста ошибок

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\

*Список всех событий, генерируемых в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `products:changed` - изменение массива товаров
- `items:changed` - изменение массива товаров в корзине
- `product:selected` - изменение открываемого в модальном окне товара

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `modal:changed` - изменение контента модального окна
- `product:select` - выбор товара для просмотра в модальном окне
- `product:previewClear` - необходима очиста данных выбранного для показа в модальном окне товара
- `item:select` - выбор карточки для добавления в корзину
- `item:delete` - выбор товара для удаления из корзины
- `order:input` - изменение данных в форме с информацией заказа
- `contacts:input` - изменение данных в форме с контактами пользователя
- `order:submit` - сохранение данных о заказе в форме
- `contacts:submit` - сохранение данных о контактах пользователя в форме
- `order:validation` - событие, сообщающее о необходимости валидации формы заказа
- `contacts:validation` - событие, сообщающее о необходимости валидации формы контактов