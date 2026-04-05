import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../admin/model/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  product=input.required<Product>();


}
