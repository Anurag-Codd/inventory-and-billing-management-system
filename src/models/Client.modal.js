import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: { type: String },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    type: {
      type: String,
      enum: ["customer", "vendor"],
      required: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

clientSchema.index({ name: "text", email: "text", phone: "text" });

const Client = mongoose.model("client", clientSchema);

export default Client;
