import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModalSettings {
    closeButton: string;
    content: string;
}

export class Modal extends Component<HTMLElement, IModalSettings> {
    protected _content: HTMLElement;

    constructor(element: HTMLElement, settings: IModalSettings, events: IEvents) {
        super(element, settings, events);

        this._content = this.ensure(this.element, settings.content);

        // Реализация закрытия по клику на кнопку, оверлей, Esc
        const closeButton = this.ensure(this.element, this.settings.closeButton);
        closeButton.addEventListener('click', this.close.bind(this));
        this.element.addEventListener('mousedown', evt => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });
        this.handleEscUp = this.handleEscUp.bind(this);
    }

    open() {
        this.element.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscUp);
    }

    close() {
        this.element.classList.remove('modal_active');
        document.removeEventListener('keyup', this.handleEscUp);
    }

    set content(content: HTMLElement) {
        this.setChildren(this._content, content);
    }

    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    };
}