import { Request, Response } from 'express';
import Note from '../models/Note';
import User from '../models/User';
import { z } from 'zod';

type noteRequestBody = {
	title: string;
	description: string;
};

const noteSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().min(1),
	})
	.strict();

const noteOptionalSchema = z
	.object({
		title: z.string().optional(),
		description: z.string().optional(),
	})
	.strict();

const noteShareSchema = z
	.object({
		userId: z.string().min(1),
	})
	.strict();

export const createNote = async (req: Request, res: Response) => {
	const parsed = noteSchema.safeParse(req.body);
	if (!parsed.success) res.status(400).send(parsed.error);
	else {
		const { title, description }: noteRequestBody = req.body;

		const userId = typeof req.user == 'object' ? req.user.id : '';

		const note = new Note({ title, description, createdBy: userId, hasAccess: [userId] });

		try {
			await note.save();

			res.status(200).json({ note: note._id });
		} catch (err) {
			res.status(400).send(err);
		}
	}
};

export const getNotes = async (req: Request, res: Response) => {
	const userId = typeof req.user == 'object' ? req.user.id : '';

	const notes = await Note.find({ hasAccess: userId }, { __v: 0, hasAccess: 0 });

	if (notes) res.status(200).json({ notes });
	else res.status(400).send({ message: 'No notes for spcific user' });
};

export const getNote = async (req: Request, res: Response) => {
	const userId = typeof req.user == 'object' ? req.user.id : '';

	const note = await Note.findOne({ hasAccess: userId, _id: req.params.id }, { __v: 0, hasAccess: 0 });

	if (note) res.status(200).json({ note });
	else res.status(400).send({ message: 'No note for spcific user' });
};

export const updateNote = async (req: Request, res: Response) => {
	const parsed = noteOptionalSchema.safeParse(req.body);
	if (!parsed.success) res.status(400).send(parsed.error);
	else {
		const { title, description }: noteRequestBody = req.body;

		if (title || description) {
			const userId = typeof req.user == 'object' ? req.user.id : '';

			try {
				const note = await Note.findOneAndUpdate({ hasAccess: userId, _id: req.params.id }, { title, description });

				if (note) res.status(200).json({ note: note._id });
				else res.status(400).send({ message: 'No note for spcific user' });
			} catch (err) {
				res.status(400).send(err);
			}
		} else {
			res.status(400).send({ message: 'Not all valid params are present' });
		}
	}
};

export const deleteNote = async (req: Request, res: Response) => {
	const userId = typeof req.user == 'object' ? req.user.id : '';

	const note = await Note.deleteOne({ hasAccess: userId, _id: req.params.id }, { __v: 0, hasAccess: 0 });

	if (note) res.status(200).json({ note });
	else res.status(400).send({ message: 'No note for spcific user' });
};

export const shareNote = async (req: Request, res: Response) => {
	const parsed = noteShareSchema.safeParse(req.body);
	if (!parsed.success) res.status(400).send(parsed.error);
	else {
		const { userId } = req.body;

		if (userId) {
			const authenticatedUserId = typeof req.user == 'object' ? req.user.id : '';

			try {
				const user = await User.findById(userId);
				if (user) {
					const note = await Note.findOneAndUpdate({ hasAccess: authenticatedUserId, _id: req.params.id }, { $addToSet: { hasAccess: userId } });

					if (note) res.status(200).json({ note: note._id });
					else res.status(400).send({ message: 'No note for spcific user' });
				} else res.status(400).send({ message: 'Invalid user id mentioned' });
			} catch (err) {
				res.status(400).send(err);
			}
		} else {
			res.status(400).send({ message: 'Target userId not found' });
		}
	}
};
