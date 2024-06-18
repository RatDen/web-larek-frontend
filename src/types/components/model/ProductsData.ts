import { IProduct } from "./ProductApi"

export interface IProductsData {
    items: IProduct[];
    preview: string | null;

    getProduct(id: string): void;
}