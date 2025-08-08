export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  isActive: boolean;
}