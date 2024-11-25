const cartSchema = require("../../modles/schema/cartSchema");
const customError = require("../../utils/customError");

//1. to show cart for specific user
const getUserCart = async (req, res) => {
  const data = await cartSchema.findOne({ userId: req.user.id }).populate({
    path: "products.productId",
    select: "name price image",
  });
  if (data) {
    res.status(200).json({
      status: "success",
      data,
    });
  } /*else {
    res.status(404).json({
      status: "fail",
      message: "cart not found",
    });*/ else {
    res.status(200).json({
      status: "success",
      data: {
        products: [],
      },
    });
  }
};

//2. to add product to cart or update quantity of product in cart
const updateUserCart = async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    next(new customError(`invalid quantity${quantity}`, 400));
  }

  let cart = await cartSchema.findOne({ userId: req.user.id });

  if (!cart) {
    //create new cart
    cart = new cartSchema({
      userId: req.user.id,
      products: [{ productId, quantity }],
    });
  } else {
    //checking if product already existing cart
    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId.toString()
    );
    if (productIndex > -1) {
      //if product already exist in cart, update quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      //if product not exist in cart, add new product
      cart.products.push({ productId, quantity });
    }
  }

  const cartSaved = await cart.save();
  await cartSaved.populate({
    path: "products.productId",
    select: "name price image",
  });
  res.status(200).json({ message: "cart updated" });
};

//3. to remove product from cart
const removeFromCart = async (req, res) => {
  //finding cart by userId and removing product from cart
  const cart = await cartSchema.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  );
  if (cart) {
    res.status(200).json({ message: "product removed from cart" });
  } else {
    res.status(404).json({ message: "cart not found" });
  }
};

module.exports = { getUserCart, updateUserCart, removeFromCart };
