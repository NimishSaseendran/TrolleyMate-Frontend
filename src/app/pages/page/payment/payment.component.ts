import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../../services/payment/payment.service';

@Component({
  selector: 'app-payment',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {

  cartItems: any[] = [];
  customer = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(
    private toastr: ToastrService,
    private paymentService: PaymentService,
  ) { }

  ngOnInit() {
    const storedCart = localStorage.getItem('cartItems');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];
  }

  getTotalAmount(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.intActualPrice * item.intQuantity,
      0
    );
  }

  fnCheckout() {
    if (!this.customer.name) {
      this.toastr.warning('Please enter customer name')
      return;
    }

    if (!this.cartItems.length) {
      this.toastr.warning('Please add products to checkout.')
      return;
    }

    const totalAmount = this.getTotalAmount();
    console.log('total amount:', totalAmount);

    this.paymentService.createOrder(totalAmount).subscribe({
      next: (order) => {
        // Prepare customer data
        const customerData = {
          name: this.customer.name,
          email: this.customer.email || 'test@example.com',
          contact: this.customer.phone || '9999999999'
        };

        // Launch Razorpay modal
        this.paymentService.openRazorpay(order, customerData);
      },
      error: (err) => {
        console.error('Error creating Razorpay order:', err);
        this.toastr.error('Failed to initiate payment. Please try again.');
      }
    });

  }
  // console.log('Customer Info:', this.customer);
  // console.log('Cart Items:', this.cartItems);
  // localStorage.removeItem('cartItems')
  // this.toastr.success('Order placed successfully!');


}
