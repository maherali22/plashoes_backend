const wishlistSchema = require("../../modles/schema/wishlistSchema");
const customError = require("../../utils/customError");

//1.to get user wishlist
const getUserWishlist = async (req, res) => {
  //find user wishlist and populate with products
  const data = await wishlistSchema
    .findOne({ userId: req.user.id })
    .populate("products");
  if (data) {
    return res.status(200).json({
      status: "success",
      data: data,
    });
  } /*else{
    throw new customError("no wishlist found", 404);
  }*/ else {
    res.status(200).json({ products: [] });
  }
};

//2.to add product to user wishlist

const addToWishlist = async (req, res, next) => {
  const { productId } = req.body;
  if (!productId) {
    return next(new customError("product id is required", 400));
  }
  //check if product is already in wishlist and update qty
  let newWishlist = await wishlistSchema.findOneAndUpdate(
    { userId: req.user.id },
    { $addToSet: { products: productId } },
    { new: true }
  );

  //if no wishlist found create new wishlist
  if (!newWishlist) {
    newWishlist = new wishlistSchema({
      userId: req.user.id,
      products: [productId],
    });
    await newWishlist.save();
    return res.status(201).json(newWishlist);
  }
  res.status(200).json({ message: "product added to wishlist" });
};

//3.to remove product from user wishlist

const removeFromWishlist = async (req, res, next) => {
  const { productId } = req.body;
  const newWishlist = await wishlistSchema.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { products: productId } },
    { new: true }
  );
  if (newWishlist) {
    res.status(201).json({ message: "product removed from wishlist" });
  } else {
    next(new customError("product not found in wishlist", 404));
  }
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
};
