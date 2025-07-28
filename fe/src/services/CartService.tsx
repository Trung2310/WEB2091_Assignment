import type { Product } from './ProductService';

export interface CartItem {
  product: Product;
  quantity: number;
}

export const cartService = {

  getCart: (): CartItem[] => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart;
  },


  addToCart: (product: Product, quantity: number): void => {
    const cart = cartService.getCart();
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);


    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {

      cart.push({ product, quantity });
    }


    localStorage.setItem('cart', JSON.stringify(cart));
  },


  removeFromCart: (productId: string): void => {
    let cart = cartService.getCart();
    cart = cart.filter(item => item.product.id !== productId);


    localStorage.setItem('cart', JSON.stringify(cart));
  },


  updateQuantity: (productId: string, quantity: number): void => {
    const cart = cartService.getCart();
    const itemIndex = cart.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      cart[itemIndex].quantity = quantity;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  },


  clearCart: (): void => {
    localStorage.removeItem('cart');
  },


  getTotalQuantity: (): number => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },


  getTotalPrice: (): number => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
};
