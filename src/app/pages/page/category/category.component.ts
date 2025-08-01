import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { PagerService } from '../../../services/pager/pager.service';

@Component({
  selector: 'app-category',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  pageTitle = 'Category';
  arrCategories: any = [];
  skipCount: any = 0;
  pageLimit: any = 10;
  totalItems: any = 0;
  pager: any;

  constructor(
    private productService: ProductService,
    private pagerService: PagerService
  ) {
    this.fnGetAllCategories();
  }

  fnGetAllCategories() {
    const obj = {
      skipCount: this.skipCount,
      pageLimit: this.pageLimit
    }
    this.productService.getAllCategories(obj).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.arrCategories = res.data;
          this.totalItems = res.total;
          const currentPage = Math.floor(this.skipCount / this.pageLimit) + 1;
          this.pager = this.pagerService.getPager(this.totalItems, currentPage, this.pageLimit);
        } else {
          console.error('Error fetching categories:', res.message);
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  loadPage(page: number) {
    this.skipCount = (page - 1) * this.pageLimit;
    this.fnGetAllCategories();
  }

}
