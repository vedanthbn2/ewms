import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import dbConnect from "../api/mongodb";

async function createAdminUser() {
  try {
    await dbConnect();

    const email = "admin@local.com";
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      name: "Admin",
      email,
      phone: "0000000000",
      password: hashedPassword,
      approved: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
