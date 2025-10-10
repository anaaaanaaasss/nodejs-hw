import mongoose from 'mongoose';

const TAGS = [
  'Work','Personal','Meeting','Shopping','Ideas',
  'Travel','Finance','Health','Important','Todo'
];

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: { type: String, enum: TAGS, default: 'Todo', trim: true },
  },
  { timestamps: true }
);


noteSchema.set('toJSON', {
  transform: (doc, ret) => {

    ret.created = ret.createdAt;
    ret.updated = ret.updatedAt;


    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;

    return ret;
  },
});

export const Note = mongoose.model('Note', noteSchema);
