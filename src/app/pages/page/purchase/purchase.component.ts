import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseComponent {

  searchTerm: string = '';
  arrProducts: any = [];
  arrSelectedProducts: any[] = [];
  pageTitle: string = 'Purchase Products'
  isDropdownOpen: boolean = false;
  totalPrice: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {
    this.fnGetProductSearched()
  }

  fnGetProductSearched() {
    const obj = {
      searchTerm: this.searchTerm ? this.searchTerm : ''
    }
    this.productService.getProductSearched(obj).subscribe((res) => {
      if (res) {
        this.arrProducts = res.data || []
        console.log('arrproductssssss', this.arrProducts);

      }
    })
  }

  onBlurInput() {
    setTimeout(() => this.isDropdownOpen = false, 200);
  }

  fnSelectProduct(product: any) {
    const existingProduct = this.arrSelectedProducts.find(p => p._id === product._id);

    if (existingProduct) {
      // 🟡 If already selected, increment the quantity
      existingProduct.intQuantity = (existingProduct.intQuantity || 1) + 1;
    } else {
      // 🟢 If new, add to selection with quantity 1
      this.arrSelectedProducts.push({
        ...product,
        intQuantity: 1
      });
    }

    // 🔄 Recalculate total price
    this.totalPrice = this.arrSelectedProducts.reduce(
      (sum, p) => sum + (p.intActualPrice || 0) * (p.intQuantity || 1),
      0
    );
  }

  fnProceedCheckout() {
    localStorage.setItem('cartItems', JSON.stringify(this.arrSelectedProducts))
    this.router.navigate(['/payments'])
  }

}
