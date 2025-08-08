import { productService } from '../services/ProductService';
import { categoryService } from '../services/CategoryService';
import { userService } from '../services/UserService';
import { brandService } from '../services/BrandService';
import { orderService } from '../services/OrderService';
import type { AuthService, BrandService, CategoryService, OrderService, ProductService, ReviewService, UserService } from '../interfaces/crud';
import { reviewService } from '../services/ReviewService';
import { authService } from '../services/AuthService';

export const API_SERVICE: {
  products: ProductService;
  brands: BrandService;
  orders: OrderService;
  categories: CategoryService;
  users: UserService;
  reviews: ReviewService,
  auth: AuthService
} = {
  products: productService,
  brands: brandService,
  orders: orderService,
  categories: categoryService,
  users: userService,
  reviews: reviewService,
  auth: authService
};
