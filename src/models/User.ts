import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  followers: string[]; // store emails of followers
  following: string[]; // store emails of users this user follows
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] },
});

export default mongoose.model<IUser>("User", UserSchema);
