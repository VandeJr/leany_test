import { OrderStatus } from '../entities/order.entity';

export class OrderItemModel {
    productId: string;
    price: number;
    quantity: number;
    subtotal: number;

    constructor(productId: string, price: number, quantity: number) {
        this.productId = productId;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = price * quantity;
    }
}

export class OrderModel {
    id: string;
    userId: string;
    total: number;
    status: OrderStatus;
    items: OrderItemModel[];
    createdAt: Date;

    constructor(id: string, userId: string, total: number, status: OrderStatus, createdAt: Date, items: OrderItemModel[]) {
        this.id = id;
        this.userId = userId;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
        this.items = items;
    }
}
