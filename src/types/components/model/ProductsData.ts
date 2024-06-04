import { IProduct } from "./ProductApi"

export interface IProductsData {
    items: IProduct[];
    preview: string | null;

    getProducts(): void;
    getProduct(id: string): void;
}