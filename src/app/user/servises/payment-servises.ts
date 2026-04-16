import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { PaymentApiConfiguration } from '../../api/payment/payment-api-configuration';
import { PaymentCreateResponse, PaymentVerifyRequest } from '../../api/payment/models';
import { createPayment, verifyPayment } from '../../api/payment/functions';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private config = inject(PaymentApiConfiguration);

  /**
   * Initiates payment for an existing order ID
   * Returns the Razorpay Order ID and details
   */
  initiatePayment(orderId: string): Observable<PaymentCreateResponse> {
    return createPayment(this.http, this.config.rootUrl, { orderId }).pipe(
      map(res => res.body as PaymentCreateResponse)
    );
  }

  /**
   * Verifies the signature after Razorpay payment is successful
   */
  verify(body: PaymentVerifyRequest): Observable<any> {
    return verifyPayment(this.http, this.config.rootUrl, { body }).pipe(
      map(res => res.body)
    );
  }
}