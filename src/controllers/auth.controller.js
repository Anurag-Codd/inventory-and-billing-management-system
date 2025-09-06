import Admin from "../models/Admin.modal.js";
import {
  signAccess,
  signRefresh,
  verifyRefresh,
} from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: "Please provide credentials" });
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ error: "Enter valid email" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password length must be 8 digit or long" });
  }
  try {
    const adminExists = await Admin.findOne({
      $or: [{ email }, { username }],
    }).lean();

    if (adminExists) {
      if (adminExists.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (adminExists.username === username) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }

    const user = Admin.create({ email, username, password });

    if (!user) {
      return res.status(400).json({ error: "Error while registration" });
    }

    const token = await signAccess(user);
    await signRefresh(res, user);

    return res.status(201).json({
      message: "User registration successfull",
      user: { ...user.toObject(), token },
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username) || !password) {
    return res.status(400).json({ error: "Please provide valid credentials" });
  }

  try {
    const user =await Admin.findOne([
      { $or: [{ email: email }, { username: username }] },
    ])
      .select("+password")
      .lean();

    if (!user) {
      return res
        .status(400)
        .json({ error: "Please provide valid credentials" });
    }

    const ok =await bcrypt.compare(password, user.password);

    if (!ok) {
      return res
        .status(400)
        .json({ error: "Please provide valid credentials" });
    }
    const token = await signAccess(user);
    await signRefresh(res, user);

    delete user.password;

    return res.status(200).json({ message: "Login successfull", user, token });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({message:"Logout successfull"})
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "unauthorized access" });
  }
  try {
    const decoded = await verifyRefresh(refreshToken);

    const user = await Admin.findById(decoded.sub).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const access = await signAccess(user);

    return res
      .status(200)
      .json({ message: "Access token refreshed", token: access });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Refresh token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    return res.status(500).json({ error: "Failed to refresh access token" });
  }
};
