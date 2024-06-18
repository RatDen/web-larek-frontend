import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IFormInfo {
    inputs: HTMLInputElement[];
}

export interface IFormSettings {
    fields: string;
    inputs: string;
    actionButton: string;
    errors: string;
}

export class Form extends Component<IFormInfo, IFormSettings> {
    protected formName: string;
    protected values: Record<string, string>;
    protected actionButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;
    protected isValid: boolean;

    constructor(element: HTMLFormElement, settings: IFormSettings, events: IEvents, onFormSubmit: Function) {
        super(element, settings, events);

        this.isValid = false;

        this.formName = this.element.getAttribute('name');

        this.values = {};

        this.element.addEventListener('input', (evt) => {
            evt.preventDefault();

            const el = evt.target as HTMLInputElement;

            this.values[el.name] = el.value;

            this.events.emit(`${this.formName}:input`, this.values)
        });

        this.actionButton = this.element.querySelector(this.settings.actionButton);
        this.actionButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            onFormSubmit();
        });

        this.errorsContainer = this.element.querySelector(this.settings.errors);
    }

    getInputValues() {
        return this.values;
    }

    setValid(isValid: boolean) {
        this.isValid = isValid;
    }

    setErrors(data: Record<string, Array<string>>) {
        this.errorsContainer.textContent = '';
        for (var key in data) {
            data[key].forEach(error => {
                const p = document.createElement('p');
                p.textContent = error;
                this.errorsContainer.appendChild(p)
            })
        }
    }

    render(data?: Partial<IFormInfo>): HTMLElement {
        this.actionButton.disabled = !this.isValid;

        return super.render(data);
    }
}