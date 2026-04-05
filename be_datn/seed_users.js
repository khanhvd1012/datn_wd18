import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user_MD.js";
import { ROLES } from "./src/config/roles.js";
import bcrypt from "bcrypt";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not set");
  process.exit(1);
}

const users = [
  {
    username: "admin",
    email: "admin@datn.com",
    password: "Admin123!",
    role: ROLES.ADMIN,
  },
  {
    username: "employee",
    email: "employee@datn.com",
    password: "Emp12345",
    role: ROLES.EMPLOYEE,
  },
  {
    username: "customer",
    email: "customer@datn.com",
    password: "Cust12345",
    role: ROLES.CUSTOMER,
  },
  {
    username: "user1",
    email: "user1@datn.com",
    password: "User12345",
    role: ROLES.USER,
  },
];

const run = async () => {
  // Add error handling for mongoose connection
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  for (const u of users) {
    // Add try-catch for user creation loop
    try {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const hashed = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashed });
        console.log("Created", u.email);
      } else {
        console.log("Already exists", u.email);
      }
    } catch (error) {
      console.error(`Error processing user ${u.email}:`, error);
    }
  }

  console.log("Done");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
