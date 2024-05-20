import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
  name: {
    type: String,
    require: true,
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
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  addresses: {
    name: String,
    mobileNo: String,
    houseNo: Number,
    street: String,
    landmark: String,
    city: String,
    country: String,

    postalcode: String,
  },
  orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);

