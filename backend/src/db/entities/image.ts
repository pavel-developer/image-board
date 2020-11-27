import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: String,
  tags: {
    type: [{
      confidence: Number,
      tag: {
        en: String
      }
    }],
    default: []
  },
  boardId: mongoose.Types.ObjectId
});

export const ImageEntity = mongoose.model('images', imageSchema);
