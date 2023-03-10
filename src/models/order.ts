import mongoose from 'mongoose';

interface OrderItemProps {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: mongoose.Types.ObjectId;
}

interface OrderProps {
  user: mongoose.Types.ObjectId;
  orderItems: OrderItemProps[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    id: string | undefined;
    status: string | undefined;
    update_time: string | undefined;
    email_address: string | undefined;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date | undefined;
  isDelivered: boolean;
  deliveredAt: Date | undefined;
}

const OrderItemSchema = new mongoose.Schema<OrderItemProps>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
});

const OrderSchema = new mongoose.Schema<OrderProps>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export type OrderDocument = mongoose.HydratedDocument<OrderProps>;

export default mongoose.model('Order', OrderSchema);
