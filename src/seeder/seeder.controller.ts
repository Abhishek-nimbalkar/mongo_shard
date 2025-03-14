import { Controller, Delete, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seed')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('products')
  async seedProducts() {
    await this.seederService.seedProducts();
    return { message: 'Products seeded successfully' };
  }

  @Post('users')
  async seedUsers() {
    await this.seederService.seedUsers();
    return { message: 'Users seeded successfully' };
  }

  @Post('all')
  async seedAll() {
    await this.seederService.seedAll();
    return { message: 'All data seeded successfully' };
  }

  @Delete()
  async delete() {
    await this.seederService.deleteAll();
    return { message: 'All data deleted successfully' };
  }
}
