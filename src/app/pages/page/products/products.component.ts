import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { PagerService } from '../../../services/pager/pager.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  skipCount: any = 0;
  pageLimit: any = 10;
  arrProducts: any = [];
  totalItems: any = 0;
  pager: any;

  pageTitle: string = 'Products'

  constructor(
    private productService: ProductService,
    private pagerService: PagerService,
  ) {
    this.fnGetAllProducts()
  }

  fnGetAllProducts() {
    const obj = {
      skipCount: this.skipCount,
      pageLimit: this.pageLimit
    }

    this.productService.getAllProducts(obj).subscribe((res) => {
      if (res && res.success) {
        this.arrProducts = res.data;
        // console.log('arrproductsssss', this.arrProducts);
        this.totalItems = res.total;

        const currentPage = Math.floor(this.skipCount / this.pageLimit) + 1;
        this.pager = this.pagerService.getPager(this.totalItems, currentPage, this.pageLimit);
      }
    });
  }

  loadPage(page: number) {
    this.skipCount = (page - 1) * this.pageLimit;
    this.fnGetAllProducts();
  }

}
