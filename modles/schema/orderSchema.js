const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    // User ID of the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // Array of products in the order
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    // Session ID for payment tracking
    sessionId: {
      type: String,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    address: {
      type: Object,
      required: true,
    },
    // Total amount for the order
    totalAmount: {
      type: Number,
      required: true,
    },
    // Payment status of the order
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed"],
    },
    // Payment method (e.g., cash on delivery, card)
    // paymentMethod: {
    //   type: String,
    //   default: "cash on delivery",
    //   enum: ["cash on delivery", "card", "online banking"],
    // },

    // Shipping status of the order
    shippingStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the Order model
module.exports = mongoose.model("order", orderSchema);
