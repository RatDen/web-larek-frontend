import { TProductCompact, TOrderFullInfo, TOrderInfo, IContacts, IOrderResult } from "./ProductApi"

export interface IOrderData {
    items: TProductCompact[];
    orderInfo: TOrderFullInfo;

    addItem(id: string, callback: Function | null): void;
	deleteItem(id: string, callback: Function | null): void;
    checkOrderValidation(data: Record<keyof TOrderInfo, string>): boolean;
    checkContactsValidation(data: Record<keyof IContacts, string>): boolean;
    pushOrder(callback: Function | null): Promise<IOrderResult>;
}