import Transaction from "../models/Transaction.modal.js";

export const transactionData = async (req, res) => {
  const user = req.user;
  const { type, from, to } = req.query;

  try {
    const query = { businessId: user._id };
    if (type) {
      query.type = type;
    }
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const txns = await Transaction.find(query).sort({ date: -1 }).lean();
    return res.json({message:"Search result", transactions: txns, count: txns.length });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const transactionHistory = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "Id is required to fetch transaction history of user" });
  }
  try {
    const txns = await Transaction.find({
      businessId: user._id,
      $or: [{ customerId: id }, { vendorId: id }],
    })
      .sort({ date: -1 })
      .lean();

    const summary = txns.reduce(
      (acc, t) => {
        acc[t.type].count += 1;
        acc[t.type].amount += t.totalAmount;
        return acc;
      },
      { sale: { count: 0, amount: 0 }, purchase: { count: 0, amount: 0 } }
    );

    return res
      .status(200)
      .json({
        message: "Transaction fetch succussfully",
        transactions: txns,
        summary,
      });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};