import { gql } from "apollo-server";
export const Schema = gql` 

type User {
  id: ID 
  username: String! 
  email: String! 
  password: String! 
  role: String 
  todos: [Todo!]! 
}

# Represents a to-do item
type Todo {
  id: ID! 
  title: String! 
  description: String! 
  status: String 
  user: User! 
}

# Response type after a successful login
type LoginResponse {
  token: String
}

# Query type to fetch users and todos
type Query {
  # Fetches all users
  users: [User!]!
  
  # Fetch a single user by ID
  user(id: ID!): User

  # Fetches all todos
  todos: [Todo!]!
  
  # Fetch a single to-do item by ID
  todo(id: ID!): Todo

  # Fetches todos for a specific user
  todosByUser(userId: ID!): [Todo!]!

  
}

# Mutation type for modifying users and todos
type Mutation {
  # Registers a new user
  registerUser(input: NewUserInput!): User!

  # Logs in a user and returns a token
  loginUser(email: String!, password: String!): LoginResponse!

  # Updates an existing user by ID
  updateUser(id: ID!, input: UpdateUserInput!): User

  # Deletes a user by ID
  deleteUser(id: ID!): String

  # Creates a new to-do item
  createTodo(input: NewTodoInput!): Todo!

  # Updates an existing to-do item by ID
  updateTodo(id: ID!, input: UpdateTodoInput!): Todo

  # Deletes a to-do item by ID
  deleteTodo(id: ID!): Todo
}

# Input type for creating a new user
input NewUserInput {
  username: String!
  email: String!
  password: String!
  role: String
  todos: [NewTodoInput] # Allow passing an array of todos
}


# Input type for updating an existing user
input UpdateUserInput {
  username: String
  email: String 
  password: String 
}

# Input type for creating a new to-do item
input NewTodoInput {
  title: String! # Title of the to-do
  description: String! # Description of the to-do
  userId: ID! # The ID of the user who owns this to-do
}

# Input type for updating an existing to-do
input UpdateTodoInput {
  title: String # Optional: New title
  description: String # Optional: New description
  status: String # Optional: New status (e.g., 'completed')
}

# Input type for deleting a user
input DeleteUserInput {
  id: ID! # The ID of the user to delete
}

# Input type for deleting a to-do
input DeleteTodoInput {
  id: ID! # The ID of the to-do to delete
}
`;
