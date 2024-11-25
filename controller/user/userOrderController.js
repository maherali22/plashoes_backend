const orderSchema = require("../../modles/schema/orderSchema");
const customError = require("../../utils/customError");
const cartSchema = require("../../modles/schema/cartSchema");

// Enum for order-related statuses
const ORDER_STATUSES = {
  PROCESSING: "processing",
  CANCELLED: "cancelled",
};

const PAYMENT_METHODS = {
  COD: "cash on delivery",
};

// 1. Cash on Delivery Order
const orderCOD = async (req, res, next) => {
  try {
    // Destructure fields from request body
    const { products, totalAmount, address } = req.body;

    // Check for missing required fields
    if (!products || !totalAmount || !address) {
      return next(
        new customError(
          "Missing required fields: products, totalAmount, or address",
          400
        )
      );
    }

    // Create a new order instance
    const newOrderInstance = new orderSchema({
      products,
      totalAmount,
      address,
      userId: req.user.id,
      paymentMethod: PAYMENT_METHODS.COD,
      shippingStatus: ORDER_STATUSES.PROCESSING,
    });

    // Save the order and populate product details
    const savedOrder = await newOrderInstance.save();
    const populatedOrder = await savedOrder.populate(
      "products.productId",
      "name price image"
    );

    // Check if any product in the order is unavailable (deleted by admin)
    const hasUnavailableProducts = populatedOrder.products.some(
      (product) => !product.productId || !product.productId.name
    );
    if (hasUnavailableProducts) {
      return next(new customError("Some products are unavailable", 400));
    }

    // Clear the user's cart
    await cartSchema.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { products: [] } }
    );

    // Save the updated order
    await populatedOrder.save();

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: { order: populatedOrder },
    });
  } catch (err) {
    next(err);
  }
};

// 2. Get All Orders for a User
const getAllOrders = async (req, res, next) => {
  try {
    // Retrieve orders for the logged-in user, sorted by creation date
    const orders = await orderSchema
      .find({ userId: req.user.id })
      .populate("products.productId", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: { orders },
    });
  } catch (err) {
    next(err);
  }
};

// 3. Get a Specific Order by ID
const getOneOrder = async (req, res, next) => {
  try {
    // Find the order by ID and user ID
    const order = await orderSchema
      .findOne({ _id: req.params.orderId, userId: req.user.id })
      .populate("products.productId", "name price image");

    if (!order) {
      return next(new customError("Order not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

// 4. Cancel an Order by ID
const cancelOneOrder = async (req, res, next) => {
  try {
    // Find the order and update its shipping status to 'cancelled'
    const order = await orderSchema.findOneAndUpdate(
      {
        _id: req.params.orderId,
        userId: req.user.id,
      },
      { $set: { shippingStatus: ORDER_STATUSES.CANCELLED } },
      { new: true } // Return the updated document
    );

    // If no order is found, throw an error
    if (!order) {
      return next(new customError("Order not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Order cancelled successfully",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  orderCOD,
  getAllOrders,
  getOneOrder,
  cancelOneOrder,
};
