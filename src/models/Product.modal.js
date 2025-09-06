import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productShema = new Schema({
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
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  businessId: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

productShema.index({ name: "text", description: "text", category: "text" });

const Product = mongoose.model("product", productShema);

export default Product;
