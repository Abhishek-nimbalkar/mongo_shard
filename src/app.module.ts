import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Order, OrderSchema } from './schemas/orders.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { User, UserSchema } from './schemas/users.schema';
import { SeederController } from './seeder/seeder.controller';
import { SeederService } from './seeder/seeder.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/some', {
      retryWrites: true,
      w: 'majority',
    }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController, SeederController],
  providers: [AppService, SeederService],
})
export class AppModule {}
