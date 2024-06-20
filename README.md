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

#### Класс Component
Является родителем для всех классов отображения. Содержит основной и необходимый функционал для каждого отображения.

Конструктор принимает HTMLElement контейнера компонента, настройки содержащие в себе строковые запросы для поиска элементов компонента, экземпляр EventEmitter.

Поля:
- element: HTMLElement - контейнер компонента
- settings: S - объект с настройками компонента
- events: IEvents - экземпляр EventEmitter
- cache: Record<string, HTMLElement> - кеш для найденных элементов коммпонента

Методы:
- ensure(root: HTMLElement, query?: string, isRequired: boolean = true): HTMLElement - ищет элемент в кеше или в элементе
- setChildren(root: HTMLElement, childs: ViewChild):void - метод для замены дочернего элемента, упрощает использование replaceChildren()
- setElement(query: string, value: HTMLElement):void - заменяет элемент
- setValue(query: string | HTMLElement, value: ViewValue, isRequired: boolean = true):void - устанавливает textContent | заменяет дочерний элемент | изменяет поля объекта , в зависимости от того что передано в value
- render(data? Partial<T>):HTMLElement - изменяет поля компонента, смежные с data, возвращает разметку компонента

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
- getProduct(id: string): void; - получает 1 товар по id из массива
- также геттеры и сеттеры для полей класса

#### Класс OrderData
Класс отвечает за хранение информации и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий.

Поля класса:
- _items: TProductCompact[]; - массив компактных версий объекта товаров
- _orderInfo: TOrderFullInfo; - общая информация о заказе
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменения данных.

Методы класса:
- addItem(item: TProductCompact, callback?: Function | null = null): void; - добавляет товар в корзину. Если передан колбэк, то выполняет его после добавления, если нет, то вызывает событие изменения массива
- deleteItem(id: string, callback?: Function | null = null): void; - удаляет товар из корзины. Если передан колбэк, то выполняет его после удаления, если нет, то вызывает событие изменения массива
- clear():void - очищает корзину
- checkFormValidation(data: Record<keyof TOrderInfo | keyof IContacts, string>, constraints: TConstraints): boolean; - проверяет валидность формы по ностройкам
- checkFieldValidation(data: { field: string, value: string }, constraints: TConstraints): boolean; - проверяет валидность поля формы по ностройкам
- pushOrder(callback: Function | null = null): Promise<IOrderResult>; - отправляет заказ на сервер. Если передан колбэк, то выполняет его после отправки, если нет, то вызывает событие оформления заказа
- также геттеры и сеттеры для полей класса

### Слой представления

#### Класс Modal
Реализует модальное окно.\
Устанавливает слушатели на клавиатуру, для закрытия по нажатию на Esc, на клик в оверлей и кнопку закрытия.
В конструктор передается HTMLElement элемента, настройки с селекторами и инстант брокера событий

Поля класса:
- content: HTMLElement - элемент контейнера модального окна, где размещается его наполнение

Методы класса:
- методы `open` и `close` для открытия и закрытия
- handleEscUp(evt: KeyboardEvent) - колбек для закрытия модалки по нажатию на Esc
- сеттер для content

#### Класс Form
Реализует класс для формы.\
Конструктор, помимо базовых параметров ожидает коллбек для подтверждения формы.

Поля:
- formName: string - name элемента формы ля удобного доступа
- inputs: NodeListOf<HTMLInputElement> - инпуты формы
- values: Record<string, string> - сохраняет значения инпутов формы
- actionButton: HTMLButtonElement - элемент кнопки сабмита формы
- errorsContainer: HTMLElement - элемент для вывода ошибок валидации
- isValid: boolean - валидность формы

Методы:
- getInputValues(): Record<string, string> - возвращает объект values
- setValid(isValid: boolean): void - устанавливает валидность формы
- clear():void - очищает поля формы
- setErrors(data: Record<string, Array<string>>):void - выводит ошибки валидации
- render(data?: Partial<IFormInfo>): HTMLElement - перед выполнением родительского render включает или выключает кнопку сабмита формы по состоянию isValid

#### Класс OrderForm
Наследует и изменяет функционал класса Form для получения данных о заказе (имеет в себе выбор метода оплаты). Изменяет состояния "радио" кнопок при выборе.

Поля:
- paymentButtons: NodeListOf<HTMLButtonElement> - кнопки выбора метода оплаты

#### Класс Basket
Реализует вывод корзины пользователя.

Поля:
- container: HTMLElement - контейнер для товаров
- actionButton: HTMLButtonElement - кнопка подтверждения товаров

Метода:
- сеттеры для каталога и итоговой стоимости
- render(data?: Partial<ICatalogInfo>): HTMLElement - модифицирует родительский метод render: перед ним проверяется наличие товаров в корзине; и при их отсутствии отключается actionButton

#### Класс Card
Отвечает за отображение карточки товара на странице сайта, в модальном окне и корзине.\
Конструктор помимо базовых параметров также принимает коллбек для кнопки (при наличии).\
В классе устанавливается слушатель на клик по карточке (в версии для превью).\
Поля класса содержат элементы разметки карточки, а также id карточки.

Методы:
- геттеры и сеттеры для установки данных в поля карточки, а также для id

#### Класс CardContainer
Отвечает за отображение блока с карточками на главной странице.\
В конструктор принимает только контейнер, куда помещается разметка карточек.\
Имеет сеттер для каталога карточек\

#### Класс Header
Отвечает за счетчик корзины в шапке сайта. Имеет сеттер для его изменения.

#### Класс OrderSuccess
Выводит информацию об успешном оформлении заказа. Имеет сеттер для итоговой суммы заказа.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса. Реализует интерфейс IProductApi

Методы:
- getProducts(): Promise<ApiListResponse<IProduct>> - запрашивает список товаров с сервера
- getProduct(id: string): Promise<IProduct> - запрашивает данные об одном товаре с сервера
- pushOrder(order: IOrder): Promise<IOrderResult> - отправляет заказ на сервер

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\

*Список всех событий, генерируемых в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `product:selected` - изменение открываемого в модальном окне товара
- `products:changed` - изменение массива товаров
- `items:changed` - изменение массива товаров в корзине

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `basket:submit` - подтверждение товаров в корзине
- `basket:open` - открытие корзины

- `modal:changed` - изменение контента модального окна

- `product:select` - выбор товара для просмотра в модальном окне
- `product:previewClear` - необходима очиста данных выбранного для показа в модальном окне товара

- `item:select` - выбор карточки для добавления в корзину
- `item:delete` - выбор товара для удаления из корзины

- `order:input` - изменение данных в форме с информацией заказа
- `contacts:input` - изменение данных в форме с контактами пользователя

- `order:submit` - сохранение данных о заказе в форме
- `contacts:submit` - сохранение данных о контактах пользователя в форме

- `order:validated` - событие после выполнения валидации формы заказа
- `contacts:validated` - событие после выполнения валидации формы контактов пользователя

- `order:completed` - завершение оформления заказа