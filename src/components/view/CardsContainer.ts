import { Component } from "../base/Component";

interface ICardsContainer {
    catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer> {
    constructor(protected element: HTMLElement) {
        super(element);
    }

    set catalog(items: HTMLElement[]) {
        this.setChildren(this.element, items);
    }
}