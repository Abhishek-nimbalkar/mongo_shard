import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { User } from '../schemas/users.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seedProducts(): Promise<void> {
    const products = [
      {
        name: 'Smartphone',
        category: 'electronics',
        price: 599,
        stock: 100,
        tags: ['mobile', 'tech'],
      },
      {
        name: 'Laptop',
        category: 'computers',
        price: 1299,
        stock: 50,
        tags: ['tech', 'portable'],
      },
      {
        name: 'TV',
        category: 'home-appliances',
        price: 799,
        stock: 30,
      },
      {
        name: 'Camera',
        category: 'photography',
        price: 499,
        stock: 20,
      },
      {
        name: 'Headphones',
        category: 'audio',
        price: 199,
        stock: 50,
      },
      {
        name: 'Monitor',
        category: 'computer-accessories',
        price: 299,
        stock: 40,
      },
      {
        name: 'Printer',
        category: 'office-equipment',
        price: 199,
        stock: 25,
      },
      {
        name: 'Router',
        category: 'networking',
        price: 99,
        stock: 60,
      },
      {
        name: 'Smart Watch',
        category: 'wearables',
        price: 299,
        stock: 35,
      },
      {
        name: 'Tablet',
        category: 'mobile-devices',
        price: 499,
        stock: 45,
      },
    ];

    await this.productModel.deleteMany({});
    await this.productModel.insertMany(products);
  }

  async seedUsers(): Promise<void> {
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          city: 'New York',
          state: 'NY',
          country: 'USA',
        },
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        address: {
          city: 'London',
          state: '',
          country: 'UK',
        },
      },
      // Add more users as needed
    ];

    await this.userModel.deleteMany({});
    await this.userModel.insertMany(users);
  }

  async seedAll(): Promise<void> {
    await this.seedProducts();
    await this.seedUsers();
  }
  async deleteAll(): Promise<void> {
    await this.productModel.deleteMany({});
    await this.userModel.deleteMany({});
  }
}
