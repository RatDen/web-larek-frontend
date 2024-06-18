import { TConstraints } from "../../../utils/constants";
import { TProductCompact, TOrderFullInfo, TOrderInfo, IContacts, IOrderResult } from "./ProductApi"

export interface IOrderData {
    items: TProductCompact[];
    orderInfo: Partial<TOrderFullInfo>;

    addItem(item: TProductCompact, callback?: Function | null): void;
	deleteItem(id: string, callback?: Function | null): void;
    checkFormValidation(data: Record<keyof TOrderInfo | keyof IContacts, string>, constraints: TConstraints): boolean;
    checkFieldValidation(data: { field: string, value: string}, constraints: TConstraints): string;
    pushOrder(callback: Function | null): Promise<IOrderResult>;
}