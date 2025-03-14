// src/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true }) // Shard key
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({
    type: [
      {
        userId: { type: String },
        rating: Number,
        comment: String,
        createdAt: Date,
      },
    ],
  })
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
