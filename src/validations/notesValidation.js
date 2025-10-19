import { Joi } from 'celebrate';
import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

// GET /notes -> validate query params
export const getAllNotesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(5).max(20).default(10),
  tag: Joi.string().valid(...TAGS).optional(),
  search: Joi.string().allow('').optional(),
});

// Routes with :noteId -> validate params
export const noteIdSchema = Joi.object({
  noteId: objectId.required(),
});

// POST /notes -> validate body
export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS).optional(),
});

// PATCH /notes/:noteId -> validate body (at least one field)
export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS),
}).min(1);
