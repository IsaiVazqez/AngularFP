import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.model';
import { catchError, Observable, map, retry } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products';

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }
    return this.http.get<Product[]>(this.apiUrl, {params})
    .pipe(
      retry(3),
      map(products => products.map(item =>{
        return {
          ...item,
          taxes:.19 * item.price
        }
      }))
    )
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
      switch(error.status) {
      case HttpStatusCode.Conflict:
       return throwError(() => new Error ('Ups algo esta fallando en el server'));
      case HttpStatusCode.NotFound:
        return throwError(() => new Error ('El producto no existe'));
      default:
        return throwError(() => new Error ('Ups algo salio mal'));
        }
      })
    )
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: {limit, offset}
    })
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`)
  }

}

