import { Product } from './product.model';

export interface ProductResponse {
    success: boolean;
    total: number;
    skipCount: number;
    pageLimit: number;
    data: Product[];
    message: any;
}
