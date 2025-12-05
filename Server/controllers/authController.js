import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// creates admin by default
export const Admin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if(existingAdmin){
      console.log(existingAdmin.email);
    }
    if (!existingAdmin) {
      const firstname = process.env.ADMIN_FIRSTNAME || "RUDRA";
      const lastname = process.env.ADMIN_LASTNAME || "TEJA";
      const email = process.env.ADMIN_EMAIL || "rudra@admin.com";
      const password = process.env.ADMIN_PASSWORD || "Admin@123";
      if (!email || !password) return;
      const confirmpassword = password;
      const hashed = await bcrypt.hash(password, 10);
      await User.create({
        firstname,
        lastname,
        email,
        password: hashed,
        confirmpassword,
        role: "admin",
      });
      console.log("Admin created:", email);
    }
  } catch (err) {
    console.error("Failed to create Admin:", err.message);
  }
};

// Signup
export const signup = async (req, res) => {
  try {
    console.log("REQ BODY =>", req.body);
    const { firstname, lastname, email, password, confirmpassword, role } =
      req.body;

    if (!firstname || !lastname || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already Exists" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });
    // Generate token when signup
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email Doesn't Exists" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "User Logined Successfully",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch admin
export const getAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      initialMessage: user.initialMessage,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin
export const updateDetails = async (req, res) => {
  try {
    const { firstname, lastname, initialMessage, password, confirmPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (initialMessage !== undefined) user.initialMessage = initialMessage;

    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "Details updated successfully",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        initialMessage: user.initialMessage,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GetUser
export const getUser = async (req,res)=>{
  try{
    const user = await User.findById(req.user.id).select("-password");
    if(!user){
      return res.status(404).json({message : "User not found"})
    }
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      initialMessage: user.initialMessage
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


