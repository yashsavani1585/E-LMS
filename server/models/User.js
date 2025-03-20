// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   userName: { type: String, required: true, unique: true, index: true },
//   userEmail: { type: String, required: true, unique: true, index: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["user", "admin", "instructor"], default: "user" },
// }, { timestamps: true });

// const User = mongoose.model("User", UserSchema);
// export default User;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true,index: true},
    userEmail: { type: String, required: true, unique: true ,index: true},
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "instructor"], default: "user" },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);
export default User;