import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Schema } from "./Schema.js";
import { resolvers } from "./resolvers.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {promisify} from "util";
import jwt from "jsonwebtoken";

dotenv.config();

mongoose
  .connect('mongodb://localhost:27017/Graphical-apiDB')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const server = new ApolloServer({
  typeDefs: Schema,
  resolvers,
  formatError: (error) => {
    return{
      message:error.message};
  }
});

startStandaloneServer(server, {
  listen: { port: 5000 },
  context: async ({ req }) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return {user:null};
  }
  try {
  const decoded = await promisify(jwt.verify)(authorization, process.env.JWT_SECRET_KEY) ;
  return {user:decoded};
  } catch (error) {
    return {user:null};
  }
  
},
}).then(() => {
  console.log(" Server ready at: http://localhost:5000");
  
}).catch((err) => {
  console.log(err);
});
