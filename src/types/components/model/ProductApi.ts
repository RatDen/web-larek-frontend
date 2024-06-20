import { ApiListResponse } from "../../../components/base/api";

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export type TProductPreview = Exclude<IProduct, 'description'>;

export type TProductFull = IProduct;

export type TProductCompact = Pick<IProduct, 'id' | 'title' | 'price'>

export interface IContacts {
    email: string;
    phone: string;
}

export interface IOrder extends IContacts {
    payment: string;
    address: string;
    total: number;
    items: string[];
}

export type TOrderFullInfo = Omit<IOrder, 'total' | 'items'>

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductApi {
    getProducts(): Promise<ApiListResponse<IProduct>>;
    getProduct(id: string): Promise<IProduct>;
    pushOrder(order: IOrder): Promise<IOrderResult>;
}