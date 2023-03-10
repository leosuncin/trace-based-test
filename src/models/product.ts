import mongoose from 'mongoose';

interface ReviewProps {
  name: string;
  rating: number;
  comment: string;
  user: mongoose.Types.ObjectId;
}

interface ProductProps {
  user: mongoose.Types.ObjectId;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  reviews: ReviewProps[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}

const ReviewSchema = new mongoose.Schema<ReviewProps>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const ProductSchema = new mongoose.Schema<ProductProps>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [ReviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export type ProductDocument = mongoose.HydratedDocument<ProductProps>;

export default mongoose.model('Product', ProductSchema);
