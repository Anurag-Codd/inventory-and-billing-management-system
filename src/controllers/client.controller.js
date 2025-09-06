import Client from "../models/Client.modal.js";

export const createClient = async (req, res) => {
  const user = req.user;
  const { name, phone, email, address, type } = req.body;

  if (!name || !phone || !type) {
    return res.status(400).json({ error: "Name, Phone and type is required" });
  }

  let clientData = { name, phone, type, businessId: user._id };

  if (email) clientData.email = email;
  if (address) clientData.address = address;

  try {
    const client = await Client.create(clientData);

    if (!client) {
      return res.status(400).json({ error: "Error while creating client" });
    }

    return res.status(201).json({ message: "Client Created" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateClientData = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { phone, email, address } = req.body;

  if (!(phone || email || address)) {
    return res.status(400).json({ error: "Provide at least one field" });
  }

  try {
    let clientData = {};
    if (phone) clientData.phone = phone;
    if (email) clientData.email = email;
    if (address) clientData.address = address;

    const updatedClient = await Client.findOneAndUpdate(
      {
        _id: id,
        businessId: user._id,
      },
      clientData
    );

    if (!updatedClient) {
      return res.status(400).json({ error: "Client not found" });
    }

    return res.status(200).json({ message: "Client data updated" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteClient = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const deletedClient = await Client.findOneAndDelete({
      _id: id,
      businessId: user._id,
    });

    if (!deletedClient) {
      return res.status(400).json({ error: "Unable to delete Client data" });
    }

    return res.status(200).json({ message: "client data is deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const fetechClients = async (req, res) => {
  const user = req.user;
  try {
    const clients = await Client.find({ businessId: user._id });

    if (!clients) {
      return res.status(400).json({ error: "No client were found" });
    }

    return res
      .status(200)
      .json({ message: "clents fetched Successfully", clients });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const ClientQuery = async (req, res) => {
  const user = req.user;
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const clients = await Client.find({
      businessId: user._id,
      $text: { $search: q },
    });

    if (clients.length === 0) {
      return res.status(400).json({ error: "No clients where found" });
    }

    return res.status(200).json({ message: "Query fetched", clients });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
