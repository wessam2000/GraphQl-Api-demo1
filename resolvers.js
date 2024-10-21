import { User } from "./models/User.js";
import { Todo } from "./models/Todo.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      return users;
    },
    user: async (_, { id }) => {
      const user = await User.findById(id);
      return user;
    },
    todos: async () => {
      const todos = await Todo.find();
      return todos;
    },
    todo: async (_, { id }) => {
      console.log(id);
      
      const todo = await Todo.findById(id);
      return todo;
    },
    todosByUser: async (_, { userId },context) => {
      if (!context.user) {
        throw new Error("User not authenticated");
      }
      const todos = await Todo.find({ userId });
      return todos;
    },
  },
  Mutation: {
    registerUser: async (_, { input }) => {
      const { email, username, password, role } = input;

      // Validate input (additional validation can be added if needed)
      if (!email || !username || !password) {
        throw new Error("All fields are required.");
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }

      // Create the new user
      const newUser = new User({
        email,
        username,
        password,
        role: role,
      });

      // Save the user to the database
      await newUser.save();

      return newUser;
    },
    loginUser: async (_, { email, password }) => {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "3h",
        }
      );

      return { token };
    },
    updateUser: async (_, { id, input }, context) => {
      console.log(input);

      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const updatedUser = await User.findByIdAndUpdate(id, input, {
        new: true,
      });
      return updatedUser;
    },
    deleteUser: async (_, { id }, context) => {
      if (context.user && context.user.role === "admin") {
        const deletedUser = await User.findByIdAndDelete(id);
        return "User deleted successfully";
      } else {
        throw new Error("Unauthorized");
      }
    },

    createTodo: async (_, { input }, context) => {
      console.log(input);

      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const { title, description, userId } = input;
      const newTodo = await Todo.create({
        title,
        description,
        userId,
      });

      console.log(newTodo, "New Todo Created!");

      return newTodo;
    },
    updateTodo: async (_, { id, input }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const updatedTodo = await Todo.findByIdAndUpdate(id, input, {
        new: true,
      });
      return updatedTodo;
    },
    deleteTodo: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const deletedTodo = await Todo.findByIdAndDelete(id);
      return deletedTodo;
    },
  },
};
