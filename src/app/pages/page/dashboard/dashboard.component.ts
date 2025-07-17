import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class DashboardComponent implements OnInit {
  arrProducts: any[] = [];
  apiBaseUrl = 'http://192.168.217.66:5000'; // Change to your Pi IP

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Update product list based on scanned RFID data
   */
  fnUpdateProduct(newProduct: any): void {
    // Check if the product already exists
    const existingProduct = this.arrProducts.find((p) => p.id === newProduct.id);

    if (existingProduct) {
      // Update the count if the product already exists
      existingProduct.count += newProduct.count;
    } else {
      // Set a price if it doesn't exist
      if (!newProduct.price) {
        newProduct.price = Math.floor(Math.random() * (75 - 25 + 1)) + 25; // Random price between 25 and 75
      }
      this.arrProducts.push(newProduct);
    }

    // Save to localStorage for persistence
    localStorage.setItem('products', JSON.stringify(this.arrProducts));

    // Sync with backend
    this.http.post(`${this.apiBaseUrl}/api/products`, newProduct).subscribe(
      () => console.log('Product updated on server'),
      (error) => console.error('Error updating server:', error)
    );
  }

  /**
   * Increment the count of a product
   */
  fnIncrementCount(product: any): void {
    product.count++;
    this.fnUpdateCount(product); // Update the count in the server and local storage
  }

  /**
   * Decrement the count of a product (ensure it doesn't go below 1)
   */
  fnDecrementCount(product: any): void {
    if (product.count > 1) {
      product.count--;
      this.fnUpdateCount(product); // Update the count in the server and local storage
    }
  }

  /**
   * Update product count when the input field loses focus (or when directly updated)
   */
  fnUpdateCount(product: any): void {
    // Update the count on the server
    this.http.post(`${this.apiBaseUrl}/api/products`, product).subscribe(
      () => console.log('Product count updated on server'),
      (error) => console.error('Error updating server:', error)
    );

    // Save to localStorage for persistence
    localStorage.setItem('products', JSON.stringify(this.arrProducts));
  }

  /**
   * Poll the /scan API for real-time RFID scans with error handling
   */
  fnScanRFID(): void {
    this.http.get(`${this.apiBaseUrl}/scan`).subscribe(
      (response: any) => {
        if (response.scanned) {
          this.fnUpdateProduct(response);
        }
        setTimeout(() => this.fnScanRFID(), 1000); // Continue polling after 1 sec
      },
      (error) => {
        console.error('Scan error:', error);
        setTimeout(() => this.fnScanRFID(), 3000); // Retry after 3 sec on failure
      }
    );
  }

  /**
   * Reset the product list
   */
  fnResetProducts(): void {
    this.arrProducts = [];
    localStorage.removeItem('products');

    // Reset products on backend
    this.http.post(`${this.apiBaseUrl}/api/reset`, {}).subscribe(
      () => console.log('Products reset on server'),
      (error) => console.error('Error resetting products:', error)
    );
  }

  ngOnInit(): void {
    // Load products from localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      this.arrProducts = JSON.parse(savedProducts);
    }

    // Fetch products from server
    this.http.get(`${this.apiBaseUrl}/api/products`).subscribe(
      (data: any) => (this.arrProducts = data),
      (error) => console.error('Error fetching products:', error)
    );

    this.fnScanRFID(); // Start scanning
  }

  fnCalculateSubTotal(): number {
    return this.arrProducts.reduce((sum, product) => sum + product.count * product.price, 0);
  }

  fnCheckout() {
    this.router.navigate(['payments']);
  }
}
