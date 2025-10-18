import { Joi } from 'celebrate';
import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

export const getAllNotesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(5).max(20).default(10),
  tag: Joi.string().valid(...TAGS).optional(),
  search: Joi.string().allow('').optional(),
});

export const noteIdParamsSchema = Joi.object({
  noteId: objectId.required(),
});

export const createNoteBodySchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow('').default(''),
  tag: Joi.string().valid(...TAGS).optional(),
});

export const updateNoteParamsSchema = Joi.object({
  noteId: objectId.required(),
});

export const updateNoteBodySchema = Joi.object({
  title: Joi.string().min(1),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS),
}).min(1);
