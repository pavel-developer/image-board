import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Board'
  }
});

export const BoardEntity =  mongoose.model('boards', boardSchema);