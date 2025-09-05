import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendResetLink } from "../utils/sendResetLink.js";

const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const { _id, name, email } = user;
  res.json({ token, user: { _id, name, email } });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });
    sendToken(user, res);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    sendToken(user, res);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUser = async (req, res) => {
  res.json({ user: req.user });
};

export const logout = async (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const rawToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      const resetUrl = `${
        process.env.CLIENT_URL
      }/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(
        email
      )}`;
      await sendResetLink({ to: email, url: resetUrl });
    }
    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      email,
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Token invalid or expired" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password updated. You can login now." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
