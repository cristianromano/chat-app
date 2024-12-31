import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { email, fullName, password, profilePic } = req.body;
    const user = await User.find({ email });
    if (user.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      profilePic,
    });

    const token = generateToken(newUser, res);

    await newUser.save();
    res.status(201).json({
      token,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user, res);

    res.status(200).json({
      token,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Sign out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { email, fullName, profilePic } = req.body;
    const imageCloud = "";
    if (profilePic) {
      imageCloud = await cloudinary.uploader.upload(
        profilePic,
        async (error, result) => {
          if (error) {
            return res.status(400).json({ message: "Upload image failed" });
          }
          return result.secure_url;
        }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        email,
        fullName,
        profilePic: imageCloud || profilePic,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const authCheck = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
