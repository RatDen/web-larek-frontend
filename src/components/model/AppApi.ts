import { IOrder, IOrderResult, IProduct, IProductApi } from "../../types/components/model/ProductApi";
import { ApiListResponse, IApi } from "../base/api";


export class AppApi implements IProductApi{
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    getProducts(): Promise<ApiListResponse<IProduct>> {
        return this._baseApi.get<ApiListResponse<IProduct>>('/product/').then((products: ApiListResponse<IProduct>) => products);
    }

    getProduct(id: string): Promise<IProduct> {
        return this._baseApi.get<IProduct>(`/product/${id}`).then((product: IProduct) => product);
    }

    pushOrder(order: IOrder): Promise<IOrderResult> {
        return this._baseApi.post('/order', order, 'POST').then((response: IOrderResult) => response);
    }
}