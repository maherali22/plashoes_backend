const product = require("../../models/schema/productSchema");
const customError = require("../../utils/customError");
const joischema = require("../../modles/joischema/validation");

// create product
const createProduct = async (req, res, next) => {
  const { value, error } = joischema.joiProductSchema.validate(req.body);
  if (error) {
    return next(new customError(error.details[0].message, 400));
  }
  if (!req.file || !req.file.path) {
    return next(new customError("Image not found", 400));
  }
  const newProduct = new product({
    ...value,
    image: req.file.path,
  });
  if (!newProduct) {
    return next(new customError("Product not created", 500));
  }
  await newProduct.save();
  res.status(201).json({
    message: "product created successfully",
  });
};

// update product
const updateProduct = async (req, res, next) => {
  const newProduct = await product.findById(req.params.id);
  if (!newProduct) {
    return next(new customError("Product not found", 404));
  }
  //update product image if uploaded new image
  let image = newProduct.image;
  if (req.file) image = req.file.path;
  newProduct.set({
    ...req.body,
    image: image,
  });
  await newProduct.save();
  res.status(200).json({
    message: "product updated successfully",
  });
};

// delete product
const deleteProduct = async (req, res, next) => {
  const deleteProduct = await product.findByIdAndDelete(
    req.params.id,
    { $set: { isDeleted: !isDeleted } },
    { new: true }
  );
  if (!deleteProduct) return next(new customError("Product not found", 404));
  res.status(200).json({
    message: "product deleted successfully",
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
};
