import { IOrderData } from "../../types/components/model/OrderData";
import { IContacts, IOrder, IOrderResult, TOrderFullInfo, TOrderInfo, TProductCompact } from "../../types/components/model/ProductApi";
import { TConstraints } from "../../utils/constants";
import { IEvents } from "../base/events";
const validate = require("validate.js");


export class OrderData implements IOrderData {
    protected _items: TProductCompact[];
    protected _orderInfo: TOrderFullInfo;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;

        this._orderInfo = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        }

        this._items = [];
    }

    set items(items: TProductCompact[]) {
        this._items = items;
        this.events.emit('items:changed');
    }

    get items() {
        return this._items;
    }

    set orderInfo(data: Partial<TOrderFullInfo>) {
        Object.assign(this._orderInfo, data);
    }

    get orderInfo() {
        return this._orderInfo;
    }

    get total() {
        return this._items.map(item => {
            if (typeof item.price === 'number') {
                return item.price;
            } else {
                return 0;
            }
        }).reduce((a, b) => a+b, 0);
    }

    get order() {
        const order: IOrder = {
            ...this._orderInfo,
            total: this.total,
            items: this._items.map(item => item.id),
        }
        return order;
    }

    addItem(item: TProductCompact, callback?: Function | null): void {
        this._items = [...this._items, item];

        if (callback) {
            callback();
        }

        this.events.emit('items:changed');
    }

    deleteItem(id: string, callback?: Function | null): void {
        this._items = this._items.filter(item => item.id !== id);

        if (callback) {
            callback();
        }

        this.events.emit('items:changed');
    }

    clear() {
        this._items = [];

        this.events.emit('items:changed');
    }

    checkFormValidation(data: Record<keyof TOrderInfo | keyof IContacts, string>, constraints: TConstraints): boolean {
        const isValid = validate(data, constraints);
        return isValid;
    }

    checkFieldValidation(data: { field: string, value: string }, constraints: TConstraints): string {
        const result = validate.single(data.value, constraints[data.field]);
        if (result) {
            return result[0];
        } else {
            return '';
        }
    }

    pushOrder(callback: Function): Promise<IOrderResult> {
        return callback(this.order)
    }
}