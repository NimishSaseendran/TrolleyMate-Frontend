import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../models/product-response-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(obj: any): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/api/product/getAllProducts`,
      {
        params: obj
      }
    )
  }

  getProductSearched(obj: any): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/api/product/getSearchedProduct`,
      {
        params: obj
      }
    )
  }

  addProduct(obj: any): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.baseUrl}/api/product/addProduct`, obj)
  }

  productBulkUpload(obj: any): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.baseUrl}/api/product/bulkUpload`, obj)
  }

  updateProduct(obj: any, id: any): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.baseUrl}/api/product/updateProduct/${id}`, obj)
  }
}
