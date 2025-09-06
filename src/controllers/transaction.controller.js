import Client from "../models/Client.modal.js";
import Product from "../models/Product.modal.js";
import Transaction from "../models/Transaction.modal.js";

export const genarateSaleOrPurchase = async (req, res) => {
  const user = req.user;
  try {
    const { type, customerId, vendorId, products, date } = req.body;

    if (!type || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Type and products are required" });
    }

    if (type === "sale" && !customerId) {
      return res
        .status(400)
        .json({ error: "customerId is required for sales" });
    }

    if (type === "purchase" && !vendorId) {
      return res
        .status(400)
        .json({ error: "vendorId is required for purchases" });
    }

    if (type === "sale" && customerId) {
      const cust = await Client.findOne({
        _id: customerId,
        businessId: user._id,
        type: "customer",
      });
      if (!cust) return res.status(400).json({ error: "Invalid customerId" });
    }

    if (type === "purchase" && vendorId) {
      const vend = await Client.findOne({
        _id: vendorId,
        businessId: user._id,
        type: "vendor",
      });
      if (!vend) return res.status(400).json({ error: "Invalid vendorId" });
    }

    const productIds = products.map((p) => p.productId);
    const dbProducts = await Product.find({
      _id: { $in: productIds },
      businessId: user._id,
    });

    if (dbProducts.length !== productIds.length) {
      return res
        .status(400)
        .json({ error: "One or more products not found for this business" });
    }

    if (type === "sale") {
      const availability = products.every((p) => {
        const storedProduct = dbProducts.find(
          (stored) => stored._id.toString() === p.productId.toString()
        );
        return storedProduct && storedProduct.stock >= p.quantity;
      });

      if (!availability) {
        return res.status(400).json({ error: "Not enough quantity in stock" });
      }
    }

    for (const item of products) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          businessId: user._id,
        },
        type === "sale"
          ? { $inc: { stock: -item.quantity } }
          : { $inc: { stock: item.quantity } },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res
          .status(400)
          .json({ error: "Error while updating product stock" });
      }
    }

    const totalAmount = products.reduce(
      (acc, p) => acc + p.price * p.quantity,
      0
    );

    const newTransaction = await Transaction.create({
      type,
      customerId: type === "sale" ? customerId : undefined,
      vendorId: type === "purchase" ? vendorId : undefined,
      products,
      totalAmount,
      date: date ? new Date(date) : undefined,
      businessId: user._id,
    });

    if (!newTransaction) {
      return res.status(400).json({ error: "Transaction failed" });
    }

    return res.status(200).json({ message: `${type} recorded successfully` });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
