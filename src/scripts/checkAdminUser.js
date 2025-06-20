const mongoose = require("mongoose");
const User = require("../app/models/User").default; // Adjust path if needed
const dbConnect = require("../app/api/mongodb").default; // Adjust path if needed

async function checkAdminUser() {
  try {
    await dbConnect();

    const email = "admin@local.com";
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      console.log("Admin user not found.");
    } else {
      console.log("Admin user found:");
      console.log("Email:", adminUser.email);
      console.log("Name:", adminUser.name);
      console.log("Phone:", adminUser.phone);
      console.log("Password hash:", adminUser.password);
      console.log("Approved:", adminUser.approved);
    }
    process.exit(0);
  } catch (error) {
    console.error("Error checking admin user:", error);
    process.exit(1);
  }
}

checkAdminUser();
