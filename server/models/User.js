import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "instructor"], default: "user" },
  }, { timestamps: true });
  
  const User = mongoose.model("User", UserSchema);
  export default User;
  
