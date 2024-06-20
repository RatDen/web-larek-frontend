import { IEvents } from "../base/events";
import { Form, IFormInfo, IFormSettings } from "../common/Form";



export class OrderForm extends Form {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(element: HTMLFormElement, settings: IFormSettings, events: IEvents, onFormSubmit: Function) {
        super(element, settings, events, onFormSubmit);

        this.values = {payment: ''}

        this.paymentButtons = this.element.querySelectorAll('.button_alt');

        this.element.addEventListener('click', (evt) => {
            evt.preventDefault();

            const el = evt.target as HTMLButtonElement;

            if (el.type === 'button') {
                this.values['payment'] = el.name;
                this.events.emit(`${this.formName}:payment:changed`, { payment: this.values['payment'] });
                this.events.emit(`${this.formName}:input`, this.values)
            }
        })
    }

    clear() {
        super.clear();
        this.events.emit(`${this.formName}:payment:changed`, { payment: this.values['payment'] });
    }

    render(data?: Partial<IFormInfo>): HTMLElement;
    render(data?: Record<string, string>): HTMLElement;
    
    render(data?: Record<string, string>): HTMLElement {
        if (data) {
            this.paymentButtons.forEach(button => {
                if (button.name === data.payment) {
                    button.classList.add('button_alt-active');
                } else {
                    button.classList.remove('button_alt-active');
                }
            });
        }

        return super.render();
    }
}