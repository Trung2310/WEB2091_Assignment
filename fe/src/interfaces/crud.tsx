import type Order from "../pages/client/order/Order";
import type { Brand } from "./brands";
import type { Category } from "./categories";
import type { Product } from "./products";
import type { Review } from "./reviews";
import type { User } from "./users";

export interface CrudService<T, CreateDto = Omit<T, 'id'>, IDType = string> {
  getAll: (search?: any) => Promise<T[]>;
  getById: (id: IDType) => Promise<T>;
  add: (data: CreateDto) => Promise<T>;
  update: (id: IDType, data: T) => Promise<T>;
  remove: (id: IDType) => Promise<void>;
}
export interface ProductService extends CrudService<Product, Omit<Product, 'id'>, string> {
}
export interface BrandService extends CrudService<Brand, Omit<Brand, 'id'>, string> {
}
export interface CategoryService extends CrudService<Category, Omit<Category, 'id'>, string> {
}
export interface OrderService extends CrudService<Order, Omit<Order, 'id'>, string> {
  getOrderByUser: (userId: string) => Promise<Order[]>;
}
export interface ReviewService extends CrudService<Review, Omit<Review, 'id'>, string> {
  getByProductId: (id: string) => Promise<Review[]>;
}
export interface UserService extends CrudService<User, Omit<User, 'id'>, string> {
}
export interface AuthService {
  login: (payload: { email: string; password: string }) => Promise<any>;
  register: (payload: { email: string; password: string; fullName?: string }) => Promise<any>;
  logout: () => Promise<void>;
}

