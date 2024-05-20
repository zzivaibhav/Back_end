import mongoose ,{Schema} from "mongoose";
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
  imageOne: {
    type: String,
    required: true,
  },
  imageTwo: {
    type: String,
    required: true,
  },
  imageThree: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  productSlider: {
    type: Boolean,
    required: true,
  },
  deals: {
    type: Boolean,
    required: true,
  },
  // instock: {
  //   type: Boolean,
  //   required: true,
  // },
});

export const Product = mongoose.model('Product', productSchema);
