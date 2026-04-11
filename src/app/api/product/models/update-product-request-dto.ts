export interface UpdateProductRequestDto {
  brand: string;
  categoryId: string; // Using string to handle UUIDs from the backend
  description?: string;
  name: string;
  price: number;
  productColor: string; // Supporting Hex strings (e.g., #540808)
  productSize: string;  // Supporting flexible strings (e.g., S, XL, 32x34)
}