export class CartItemModel {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;

    constructor(productId: string, productName: string, unitPrice: number, quantity: number) {
        this.productId = productId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = Number((unitPrice * quantity).toFixed(2));
    }
}

export class CartModel {
    id: string;
    userId: string;
    items: CartItemModel[];
    total: number;

    constructor(id: string, userId: string, items: CartItemModel[]) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.total = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    }
}
