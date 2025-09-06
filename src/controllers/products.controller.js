import Product from "../models/Product.modal.js";

export const createProduct = async (req, res) => {
  const user = req.user;
  const { name, description, price, stock, category } = req.body;

  if (!name || !description || !price || !stock || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if ((price && Number(price) <= 0) || isNaN(price)) {
    return res.status(400).json({ error: "Price must be greater than zero" });
  }

  if ((stock && Number(stock) < 0) || isNaN(stock)) {
    return res.status(400).json({ error: "Stock can't be negative" });
  }

  try {
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      businessId: user._id,
    });

    if (!product) {
      return res.status(400).json({ error: "Error while creating product" });
    }

    return res
      .status(201)
      .json({ message: "Product added", product: { ...product.toObject() } });
  } catch (error) {
    return res.status(500).json({ error: "Something went Wrong" });
  }
};

export const updateProduct = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Id is required to update product" });
  }

  if (!(name || description || price)) {
    return res
      .status(400)
      .json({ error: "Provide at least one field to update" });
  }

  if ((price && Number(price) <= 0) || isNaN(price)) {
    return res.status(400).json({ error: "Price must be greater than zero" });
  }

  try {
    const productData = {};
    if (name) productData.name = name;
    if (description) productData.description = description;
    if (price) productData.price = Number(price);

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, businessId: user._id },
      productData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Id is required to delete product" });
  }
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      businessId: user._id,
    });

    if (!deletedProduct) {
      return res
        .status(400)
        .json({ error: "Product not found or unauthorized" });
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const fetchProducts = async (req, res) => {
  const user = req.user;
  try {
    const products = await Product.find({ businessId: user._id });

    if (!products) {
      return res.status(404).json({ error: "No products were found" });
    }
    return res.status(200).json({message:"Products fetched successfully", products})
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const searchQuery = async (req, res) => {
  const user = req.user;
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }
  try {
    const products = await Product.find({
      businessId: user._id,
      $text: { $search: q },
    });

    if (products.length === 0) {
      return res.status(404).json({ error: "No products were found" });
    }

    return res.status(200).json({ message: "Query fetched", products });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const stockTracking = async (req, res) => {
  const { id } = req.params;
  const { increment, decrement } = req.body;

  if (
    (increment === undefined || isNaN(increment)) &&
    (decrement === undefined || isNaN(decrement))
  ) {
    return res.status(400).json({ error: "enter valid value" });
  }

  let updateStock = 0;
  if (increment) updateStock += Number(increment);
  if (decrement) updateStock -= Number(decrement);

  try {
    const stockUpdate = await Product.findOneAndUpdate(
      { _id: id },
      { $inc: { stock: updateStock } },
      { new: true, runValidators: true }
    ).lean();

    if (!stockUpdate) {
      return res.status(400).json({ error: "product not found" });
    }

    return res.status(200).json({ message: "Stock quantity updated" });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
};
