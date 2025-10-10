import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().lean();
    res.status(200).json(notes);
  } catch (e) { next(e); }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId).lean();
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (e) { next(e); }
};

export const createNote = async (req, res, next) => {
  try {
    const created = await Note.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateNote = async (req, res, next) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.noteId,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!updated) throw createHttpError(404, 'Note not found');
    res.status(200).json(updated);
  } catch (e) { next(e); }
};

export const deleteNote = async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.noteId).lean();
    if (!deleted) throw createHttpError(404, 'Note not found');
    res.status(200).json(deleted);
  } catch (e) { next(e); }
};
