import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface IHeaderSettings {
    basketButton: string;
    basketCounter: string;
}

export class Header extends Component<HTMLElement, IHeaderSettings> {
    protected basketCounter: HTMLElement;

	constructor( element: HTMLElement, settings: IHeaderSettings, events: IEvents) {
		super(element, settings, events);

        this.basketCounter = this.ensure(this.element, this.settings.basketCounter);

		const basketButton = this.ensure(this.element, this.settings.basketButton);
		basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

    set counter(value: number) {
        this.setValue(this.basketCounter, value.toString());
    }
}