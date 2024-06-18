import { IProduct } from "../../types/components/model/ProductApi";
import { CDN_URL, cardCategories } from "../../utils/constants";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface ICardSettings {
    title: string;
    category: string;
    image: string;
    description: string;
    button: string;
    price: string;
}

export function handleAddCard() {
    this.events.emit('item:select', {product: this.cardId});
}

export function handleDeleteCard() {
    this.events.emit('item:delete', {product: this.cardId});
}

export class Card extends Component<IProduct, Partial<ICardSettings>> {
    protected cardId: string;

    constructor(element: HTMLElement, settings: Partial<ICardSettings>, events: IEvents, buttonCallback?: Function) {
        super(element, settings, events);

        if (settings.button && buttonCallback) {
            const button = this.ensure(this.element, this.settings.button);
            button.addEventListener('click', buttonCallback.bind(this))
        } else {
            this.element.addEventListener('click', () => {
                this.events.emit('product:select', {product: this.cardId})
            });
        }
    }

    set id(id:string) {
        this.cardId = id;
    }

    get id() {
        return this.cardId;
    }

    set title(text:string) {
        if (this.settings.title) {
            this.setValue(this.settings.title, text);
        }
    }

    set category(category:string) {
        if (this.settings.category) {
            this.setValue(this.settings.category, category);
            this.setValue(this.settings.category, {className: 'card__category ' + cardCategories[category]})
        }
    }

    set image(link:string) {
        if (this.settings.image) {
            this.setValue(this.settings.image, {src: CDN_URL + link});
        }
    }

    set description(text:string) {
        if (this.settings.description) {
            this.setValue(this.settings.description, text);
        }
    }

    set price(value:string) {
        if (this.settings.price) {
            this.setValue(this.settings.price, `${value === null? 'Бесценно' : `${value} синапсов`}`);
        }
    }
}