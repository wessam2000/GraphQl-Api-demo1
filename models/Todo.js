import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [20, "Title must be at most 20 characters long"],
  },
  description: {
    type: String,
    required: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [200, "Description must be at most 200 characters long"],
  },
  status: {
    type: String,
    enum: ['todo','inprogress','done'],
    default: "todo",
  },  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

})
export const Todo = mongoose.model("Todo", todoSchema);