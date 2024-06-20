import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ICatalogInfo {
	catalog: HTMLElement[];
}

interface IBasketSettings {
	actionButton: string;
    catalog: string;
	itemIndex: string;
	total: string;
}

export class Basket extends Component<ICatalogInfo, IBasketSettings> {
    protected container: HTMLElement;
	protected actionButton: HTMLButtonElement;

	constructor( element: HTMLElement, settings: IBasketSettings, events: IEvents) {
		super(element, settings, events);

        this.container = this.ensure(this.element, this.settings.catalog);

		this.actionButton = this.ensure(this.element, this.settings.actionButton) as HTMLButtonElement;
		this.actionButton.addEventListener('click', () => {
			this.events.emit('basket:submit');
		});
	}

    set catalog(items: HTMLElement[]) {
		var counter = 1;
		items.forEach(item => {
			const index = item.querySelector(this.settings.itemIndex);

			if (index) {
				index.textContent = (counter++).toString();
			}
		})
        this.setChildren(this.container, items);
		this.actionButton.disabled = (items.length === 0);
    }

	set total(value: number) {
		this.setValue(this.settings.total, `${value} синапсов` )
	}
}
