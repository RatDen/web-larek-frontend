export interface IView<T, S = object> {
	// отображение для заданного типа данных
	element: HTMLElement; // корневой элемент
	copy(settings?: S): IView<T>; // копирующий конструктор
	render(data?: Partial<T>): HTMLElement; // метод рендера
}

export interface IViewConstructor<T, S> {
	// конструктор отображения
	// получает на вход клонированный шаблон
	// или существующий элемент,
	// а также настройки для отображения
	new (root: HTMLElement, settings: S): IView<T>;
}

// Чтобы события настраивались единообразно, пропишем их здесь

// Настройки для кликабельного отображения (кнопки, карточки...)
export type IClickableEvent<T> = { event: MouseEvent; item?: T };
export interface IClickable<T> {
	onClick: (args: IClickableEvent<T>) => void;
}

// Настройки для изменяемого отображения (формы, переключатели...)
export type IChangeableEvent<T> = { event: Event; value?: T };
export interface IChangeable<T> {
	onChange: (args: IChangeableEvent<T>) => void;
}

// Настройки для выбираемого отображения (списки, таблицы...)
export type ISelectableEvent<T> = { event: Event; value?: T };
export interface ISelectable<T> {
	onSelect: (args: ISelectableEvent<T>) => void;
}

// Базовое отображение
export abstract class BaseView<S extends object> {
    // чтобы при копировании создавать дочерний класс, не зная его имени
    ['constructor']!: new (root: HTMLElement, settings: S) => this;
    // флаг установки слушателей
    protected isConfiguredListeners = false;
    
    // конструктор с элементом и настройками, 
    // в простейшем виде без проверок и дефолтных значений
    constructor(protected element: HTMLElement, protected settings: S) {
        // чтобы не переопределять конструктор, для компактности и соблюдения интерфейса
        // можно реализовать так называемые методы жизненного цикла класса,
        // которые вызываются в нужный момент и могут быть легко переопределены.
        this.init();
    }
    
    // копирующий конструктор, чтобы настроить один раз
    // и дальше использовать копии отображения везде
    // но при желании можем что-то поменять, например обработчики событий
    copy(settings?: S): typeof this {
      return new this.constructor(
          this.element.cloneNode(true) as HTMLElement,
          Object.assign({}, this.settings, settings ?? {})
      );
  }
  
  // метод, который вызовем для установки слушателей из рендера или при инициализации
  protected setupListeners(callback: () => void) {
      if (!this.isConfiguredListeners) {
          callback();
          this.isConfiguredListeners = true;
      }
  }
  
  // методы жизненного цикла
  // начальная инициализация, здесь можно создать элементы, повесить слушатели и т.д.   
  protected init() {}
  
  // рендер, вызывается когда надо обновить отображение с данными
  render(data: unknown): HTMLElement {
          // Простая реализация рендера позволяющая в том числе
          // установить сеттеры для отдельных полей
          // и вызывать их через поверхностное копирование.
          if (typeof data === 'object') {
              // это не безопасная конструкция в JS, 
              // но при правильной типизации в TS можем себе позволить
              // главное это прописать тип данных для рендера в дочерних классах
              Object.assign(this, data);
            }
      return this.element;
  }  
  
  // ... другие методы которые помогут строить отображение
} 