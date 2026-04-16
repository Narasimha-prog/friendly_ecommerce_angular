import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderService } from '../servises/order-service';
import { Pagination } from '../../shared/model/request.model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { OrderItemDto } from '../../api/order/models';

@Component({
  selector: 'app-user-order',
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './user-order.html',
  styleUrl: './user-order.scss',
})
export class UserOrder {
  private orderService = inject(OrderService);
  private platformId = inject(PLATFORM_ID);

  // Use a signal or simple object for pagination to make it reactive
  pageRequest: Pagination = {
    page: 0,
    size: 20,
    sort: ['createdAt,desc'] // Sort by newest first
  };

  /**
   * TanStack Query for Order History
   * Key includes pageRequest so it refetches when page changes
   */
  orderQuery = injectQuery(() => ({
    queryKey: ['user-orders', this.pageRequest],
    queryFn: () => lastValueFrom(this.orderService.getOrderForConnectedUser(this.pageRequest)),
    enabled: isPlatformBrowser(this.platformId), // Only run in browser
    staleTime: 1000 * 60 * 2, // 2 minutes
  }));

  // Utility methods for the template
  computeItemName(items: any[] = []): string {
    return items.map(item => item.productName || 'Unknown Product').join(', ');
  }

  computeItemQuantity(items: any[] = []): number {
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }

  // Your backend usually sends the totalAmount in OrderResponseDto, 
  // but here is the manual fallback if needed:
  computeTotal(items: any[] = []): number {
    return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  }
  
}