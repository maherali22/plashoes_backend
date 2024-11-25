const mongoose = require("mongoose");

// Define the Order Schema
const orderSchema = new mongoose.Schema(
  {
    // Reference to the user placing the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Refers to the "user" collection
      required: true, // User ID is mandatory
    },
    // Array of products in the order
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products", // Refers to the "products" collection
          required: true, // Each product must have a product ID
        },
        quantity: {
          type: Number, // Number of units ordered
          default: 1, // Default quantity is 1
        },
      },
    ],
    // Session ID for payment tracking (hardcoded for now)
    sessionId: {
      type: String,
    },
    // Date of purchase, defaults to the current date and time
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    // Address object for shipping details
    address: {
      type: Object,
      required: true, // Address is mandatory
    },
    // Total amount for the order
    totalAmount: {
      type: Number,
      required: true, // Total amount is mandatory
    },
    // Payment status of the order
    paymentStatus: {
      type: String,
      default: "pending", // Default payment status
      enum: ["pending", "paid", "failed"], // Valid options
    },
    // Payment method (e.g., cash on delivery, card)
    paymentMethod: {
      type: String,
      default: "cash on delivery",
      enum: ["cash on delivery", "card", "online banking"], // Valid options
    },
    // Shipping status of the order
    shippingStatus: {
      type: String,
      default: "pending", // Default shipping status
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"], // Valid options
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the Order model
module.exports = mongoose.model("order", orderSchema);
