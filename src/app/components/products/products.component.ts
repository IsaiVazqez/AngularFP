import { Component, OnInit } from '@angular/core';
import { Product, CreateProductDTO, UpdateProductDTO } from 'src/app/models/product.model';
import { StoreService } from 'src/app/services/store.service';
import { ProductsService } from 'src/app/services/products.service';
import { concat } from 'rxjs';
import { isThisQuarter } from 'date-fns';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: ''
  };

  limit= 10;
  offset= 0;

  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10, 0)
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {

    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productsService.getProduct(id)
    .subscribe({
      next: (success) => this.showDetailOk(success),
      error: (err) => this.showDetailError(err),
      complete: () => console.log('success'),
    })
  }

  showDetailOk(data: Product) {
    this.statusDetail = 'success',
    console.log("Producto Obtenido", data),
    this.toggleProductDetail();
    this.productChosen = data;
  }

  showDetailError(err: unknown){
    this.statusDetail = 'error';
    console.error(err);
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'asdasd',
      description: 'asdasd',
      price: 1231231,
      images: [''],
      categoryId: 2,
    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data);
    });
    }

    updateProduct() {
      const changes: UpdateProductDTO = {
        title: 'saquenelsexoanal',
      }
      const id = this.productChosen.id;
      this.productsService.update(id, changes).subscribe(
        data => {
          const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
          this.products[productIndex] = data;
          this.productChosen = data;

        }
      )
    }


    deleteProduct() {
      const id = this.productChosen.id;
      this.productsService.delete(id)
      .subscribe(() => {
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      }
    )}

    loadMore() {
      this.productsService.getProductsByPage(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
    }

}
