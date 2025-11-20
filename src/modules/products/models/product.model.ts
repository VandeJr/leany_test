export class ProductModel {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        name: string,
        description: string,
        price: number,
        stock: number,
        createdAt: Date,
        updatedAt: Date,
        imageUrl?: string,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.imageUrl = imageUrl;
    }
}
