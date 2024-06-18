import { IEvents } from "./events";

type ViewChild = HTMLElement | HTMLElement[];
function isChildElement(x: unknown): x is ViewChild {
	return x instanceof HTMLElement || Array.isArray(x);
}

type ViewAttrs = 'textContent' | 'className' | 'href' | 'src' | 'alt'; // ограничиваем, что можно настроить
type ViewProps = Partial<Record<ViewAttrs, string>>; // Partial делает все поля не обязательными
type ViewValue = string | ViewChild | ViewProps; // получаем такие варианты значения

export abstract class Component<T, S = {}> {
	protected cache: Record<string, HTMLElement> = {};

	constructor(protected readonly element: HTMLElement, protected readonly settings?: S, protected events?: IEvents) {

    }

	protected ensure(
		root: HTMLElement,
		query?: string,
		isRequired: boolean = true
	) {
		if (!root) throw new Error(`Root element not found`);
		if (!query) return root;
		if (!this.cache[query]) {
			const el = this.element.querySelector(query);
			if (el) this.cache[query] = el as HTMLElement;
			else if (isRequired) throw new Error(`Element not found`);
		}
		return this.cache[query];
	}

	protected setChildren(root: HTMLElement, childs: ViewChild) {
		// ... и хотим избежать дублирования такой конструкции при каждом вызове
		root.replaceChildren(...(Array.isArray(childs) ? childs : [childs]));
	}

	protected setElement(query: string, value: HTMLElement) {
		const el = this.ensure(this.element, query);
		el.replaceWith(this.ensure(value));
	}

	// метод для универсальной установки свойств тега
	protected setValue(
		query: string | HTMLElement,
		value: ViewValue,
		isRequired: boolean = true
	) {
		const el = query instanceof HTMLElement ? query : this.ensure(this.element, query);
		if (typeof value === 'string') el.textContent = value;
		else if (isChildElement(value)) {this.setChildren(el, value); console.log('value')}
		else if (typeof value === 'object') Object.assign(el, value);
		else {
			throw new Error(`Unknown value type`);
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.element;
	}
}
