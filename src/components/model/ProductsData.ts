import { IProduct } from "../../types/components/model/ProductApi"
import { IProductsData } from "../../types/components/model/ProductsData"
import { IEvents } from "../base/events";

export class ProductsData implements IProductsData {
    protected _items: IProduct[];
    protected _preview: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('products:changed');
    }

    get items() {
        return this._items;
    }

    set preview(id: string) {
        this._preview = id;
        this.events.emit('product:selected');
    }

    get preview() {
        return this._preview;
    }

    getProduct(id: string) {
        return this._items.find(item => item.id === id);
    }
}