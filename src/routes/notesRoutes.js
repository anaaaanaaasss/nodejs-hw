import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  getAllNotesQuerySchema,
  noteIdParamsSchema,
  createNoteBodySchema,
  updateNoteParamsSchema,
  updateNoteBodySchema,
} from '../validations/notesValidation.js';

import {
  getAllNotes, getNoteById, createNote, updateNote, deleteNote
} from '../controllers/notesController.js';

import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get(
  '/notes',
  celebrate({ [Segments.QUERY]: getAllNotesQuerySchema }),
  getAllNotes
);

router.get(
  '/notes/:noteId',
  celebrate({ [Segments.PARAMS]: noteIdParamsSchema }),
  getNoteById
);

router.post(
  '/notes',
  celebrate({ [Segments.BODY]: createNoteBodySchema }),
  createNote
);

router.patch(
  '/notes/:noteId',
  celebrate({
    [Segments.PARAMS]: updateNoteParamsSchema,
    [Segments.BODY]: updateNoteBodySchema,
  }),
  updateNote
);

router.delete(
  '/notes/:noteId',
  celebrate({ [Segments.PARAMS]: noteIdParamsSchema }),
  deleteNote
);

export default router;
