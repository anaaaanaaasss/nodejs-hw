import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, perPage = 10, tag, search } = req.query;

    const filter = { userId };
    if (tag) filter.tag = tag;
    if (search && search.trim() !== '') {
      filter.$text = { $search: search.trim() };
    }

    const skip = (Number(page) - 1) * Number(perPage);

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(Number(perPage)).lean(),
      Note.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalNotes / Number(perPage)) || 1;

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (e) {
    next(e);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const note = await Note.findOne({ _id: req.params.noteId, userId }).lean();
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (e) { next(e); }
};

export const createNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const created = await Note.create({ ...req.body, userId });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId },
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!updated) throw createHttpError(404, 'Note not found');
    res.status(200).json(updated);
  } catch (e) { next(e); }
};

export const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const deleted = await Note.findOneAndDelete({ _id: req.params.noteId, userId }).lean();
    if (!deleted) throw createHttpError(404, 'Note not found');
    res.status(200).json(deleted);
  } catch (e) { next(e); }
};
