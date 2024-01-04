import { Schema, model, Document } from 'mongoose';

interface INote extends Document {
	name: string;
	email: string;
	password: string;
	date: Date;
}

const NoteSchema: Schema = new Schema({
	title: {
		type: String,
		required: true,
		min: 3,
		max: 255,
	},
	description: {
		type: String,
		required: false,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	hasAccess: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

NoteSchema.index({ description: 'text' });

const Note = model<INote>('Note', NoteSchema);
export default Note;
