

import mongoose,{Schema} from "mongoose";
const carousalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export const Carousal = mongoose.model('carousal', carousalSchema);

