import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IOrderSuccessSettings {
    description: string;
    button: string;
}

export class OrderSuccess extends Component<HTMLElement, IOrderSuccessSettings> {

    constructor(element: HTMLElement, settings: IOrderSuccessSettings, events: IEvents) {
        super(element, settings, events);

        const button = this.ensure(this.element, this.settings.button);
        button.addEventListener('click', () => {
            this.events.emit('order:completed');
        })
    }
    
    set total(value: number) {
        this.setValue(this.settings.description, `Списано ${value} синапсов`);
    }
}