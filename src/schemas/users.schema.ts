// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({
    type: {
      city: String,
      state: String,
      country: String,
    },
  })
  address: {
    city: string;
    state: string;
    country: string;
  };

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Only define the virtual field
UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});
