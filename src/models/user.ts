import argon2 from 'argon2';
import mongoose from 'mongoose';

interface UserProps {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface UserMethods {
  matchPassword: (plainPassword: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<
  UserProps,
  mongoose.Model<UserProps, {}, UserMethods>,
  UserMethods
>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

UserSchema.methods.matchPassword = async function (
  this: UserDocument,
  plainPassword: string,
) {
  return argon2.verify(this.password, plainPassword);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await argon2.hash(this.password);
});

export type UserDocument = mongoose.HydratedDocument<UserProps>;

export default mongoose.model('User', UserSchema);
