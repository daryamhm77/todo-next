import { Schema, model, models } from "mongoose";

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "todo",
  },
  who: String,
  dueDate: String,
  priority: {
    type: String,
    default: "medium",
  },
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  lastName: String,
  notes: {
    type: String,
    default: "",
  },
  todos: [todoSchema],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const User = models.User || model("User", userSchema);

export default User;
