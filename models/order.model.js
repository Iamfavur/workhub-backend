import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    deliveryDays: {
      type: Number,
      required: true,
    },
    sellerCompleted: {
      type: Boolean,
      default: false,
    },
    buyerCompleted: {
      type: Boolean,
      default: false,
    },
    orderCompleted: {
      type: Boolean,
      default: false,
    },
    deliveryCountdownEnd: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
