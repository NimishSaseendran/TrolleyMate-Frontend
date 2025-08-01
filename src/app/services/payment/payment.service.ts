import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = environment.apiUrl; // e.g., 'http://localhost:3000/api'

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  /**
   * Create Razorpay Order from backend
   */
  createOrder(amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/payment/create-order`, { amount });
  }

  /**
   * Launch Razorpay Checkout
   */
  openRazorpay(order: any, customer: { name: string; email: string; contact: string }): void {
    const options = {
      key: 'rzp_test_Zm9oq5UlG8m7DW',
      amount: order.amount,
      currency: order.currency,
      name: 'TesserIQ',
      description: 'Test Transaction',
      order_id: order.id,
      handler: (response: any) => {
        this.toastr.success('Payment Successful!');
        console.log('Payment ID:', response.razorpay_payment_id);
        console.log('Order ID:', response.razorpay_order_id);
        console.log('Signature:', response.razorpay_signature);
        localStorage.removeItem('cartItems')
        this.toastr.success('Order placed successfully!');
        setTimeout(() => {
          this.router.navigate(['/purchase-products'])
        }, 2000);

        // TODO: Send this to your backend for signature verification (in live mode)
      },
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
      },
      theme: {
        color: '#0066ff'
      }
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }
}
