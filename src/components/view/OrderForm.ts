import { IEvents } from "../base/events";
import { Form, IFormSettings } from "../common/Form";



export class OrderForm extends Form {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(element: HTMLFormElement, settings: IFormSettings, events: IEvents, onFormSubmit: Function) {
        super(element, settings, events, onFormSubmit);

        this.paymentButtons = this.element.querySelectorAll('.button_alt');

        this.element.addEventListener('click', (evt) => {
            evt.preventDefault();

            const el = evt.target as HTMLButtonElement;

            if (el.type === 'button') {
                this.paymentButtons.forEach(button => {
                    button.classList.remove('button_alt-active')
                });
                el.classList.add('button_alt-active');

                this.values['payment'] = el.name;

                this.events.emit(`${this.formName}:input`, this.values)
            }
        })
    }
}