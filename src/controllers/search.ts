import { Request, Response } from 'express';
import Note from '../models/Note';

export const searchNote = async (req: Request, res: Response) => {
	const userId = typeof req.user == 'object' ? req.user.id : '';
	const query = String(req.query.q) || '';

	const notes = await Note.find({ hasAccess: userId, $text: { $search: query } }, { __v: 0, hasAccess: 0 });

	if (notes) res.status(200).json({ notes });
	else res.status(400).send({ message: 'No notes for spcific user' });
};
