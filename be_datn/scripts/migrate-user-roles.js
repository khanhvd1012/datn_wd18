import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import User from "../src/models/user_MD.js";
import { ROLES } from "../src/config/roles.js";

dotenv.config();

const LEGACY_ROLES = ["customer", "employee"];

const run = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const before = await User.countDocuments({ role: { $in: LEGACY_ROLES } });
    console.log(`Found ${before} users with legacy roles.`);

    if (before === 0) {
      console.log("No migration needed.");
      return;
    }

    const result = await User.updateMany(
      { role: { $in: LEGACY_ROLES } },
      { $set: { role: ROLES.USER } },
    );

    console.log(`Matched: ${result.matchedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);
    console.log(`All legacy roles migrated to "${ROLES.USER}".`);
  } catch (error) {
    console.error("Role migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
