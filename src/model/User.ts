import mongoose, { Schema, Document } from "mongoose";

// Message Schema
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// User Schema
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verfiyCode: string;
  verfiyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "please use a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verfiyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verfiyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptMessage: {
    type: Boolean,
    required: true,
  },
  messages: [MessageSchema],
});

// NextJs dont know where server is created or not. So 2 condition if not created or when already created
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
