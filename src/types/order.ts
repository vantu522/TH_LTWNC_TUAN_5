

// 1. Sử dụng Generic Interface `BaseEntity<T>`:
//    - Giúp tái sử dụng các trường cơ bản như `id`, `createdAt`, `updatedAt` cho nhiều entity khác nhau.
//    - Tham số `T` cho phép kiểu `id` linh hoạt (có thể là string, number, v.v.).

// 2. Sử dụng Enums (`OrderStatus`, `PaymentMethod`):
//    - Đảm bảo tính toàn vẹn dữ liệu cho các trường có giá trị cố định, tránh lỗi chính tả khi gán giá trị (ví dụ: trạng thái đơn hàng chỉ có thể là PENDING, PROCESSING...).

// 3. Kế thừa Interface (extends BaseEntity):
//    - `Product`, `Customer`, `Order` đều kế thừa từ `BaseEntity<string>`, giảm lặp lặp code định nghĩa lại id và timestamps.

// 1. Generic Base Entity
export interface BaseEntity<T = string> {
  id: T;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {

  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

// 3. Core Interfaces
export interface Product extends BaseEntity<string> {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface Customer extends BaseEntity<string> {
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order extends BaseEntity<string> {
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  shippingAddress: string;
  notes?: string;
}

// 4. Tái sử dụng bằng Utility Types:
//    - `Omit`: `CreateProductDTO` loại bỏ các trường tự động tạo (`id`, `createdAt`, `updatedAt`) khi tạo mới một Product.
//    - `Partial`: `UpdateCustomerDTO` cho phép update một phần thông tin khách hàng, các trường đều trở thành optional.
//    - `Pick`: `CustomerSummary` lấy ra những thông tin cơ bản nhất để hiển thị nhanh (ví dụ: trong danh sách đơn hàng) mà không cần lấy toàn bộ data.
//    - `Record`: `OrderFilters` sử dụng Record để định nghĩa kiểu cho object chứa các điều kiện lọc linh hoạt.
// Tạo mới Product (không cần id, createdAt, updatedAt)
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// Cập nhật thông tin Khách hàng (tất cả các trường đều không bắt buộc, ngoại trừ id lấy từ param)
export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;

// Hiển thị tóm tắt thông tin Khách hàng trên danh sách đơn hàng
export type CustomerSummary = Pick<Customer, 'id' | 'name' | 'email'>;

// Bộ lọc đơn hàng linh hoạt
export type OrderFilters = Record<string, any>;
// Ví dụ cụ thể hơn có thể là:
export type StrictOrderFilters = Partial<Pick<Order, 'status' | 'paymentMethod' | 'customerId'>>;


// 5. Generic Type cho API Response (`ApiResponse<T>`):
//    - Chuẩn hóa format trả về của API cho bất kỳ kiểu dữ liệu nào (ví dụ: trả về 1 mảng Product, hay 1 Order duy nhất).
export interface ApiResponse<T> {
  success: boolean,
  message: string,
  data: T,
  pagination?: Paginated<T>
}

export interface Paginated<T> {
  item: T[];
  pageSize: number;
  limit: number;
  page: number
}
