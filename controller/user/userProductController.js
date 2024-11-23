const product = require("../../models/schema/productSchema");

const getAllProduct = async (req, res) => {
  const allProduct = await product.find();
  await res.send(allProduct);
};

const getProductType = async (req, res) => {
  const type = req.params.type;
  console.log(type);

  const products = await product.find({ type: type });
  console.log(products);
  res.send(products);
};

const getProductById = async (req, res) => {
  const _id = req.params.id;
  const Products = await product.findById(_id);
  res.send(Products);
};

module.exports = { getAllProduct, getProductType, getProductById };
