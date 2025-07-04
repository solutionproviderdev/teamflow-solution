// src/models/Project.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Comment {
	id: string;
	content: string;
	authorId: mongoose.Types.ObjectId;
	createdAt: Date;
}

export interface IProject extends Document {
	title: string;
	description: string;
	managerId: mongoose.Types.ObjectId;
	members: mongoose.Types.ObjectId[];
	status: 'active' | 'completed' | 'on_hold';
	iconName: string;
	comments: Comment[];
	createdAt: Date;
	deadline?: Date | null;
}

const CommentSchema = new Schema<Comment>(
	{
		id: { type: String, required: true },
		content: { type: String, required: true },
		authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		createdAt: { type: Date, default: Date.now },
	},
	{ _id: false }
);

const ProjectSchema: Schema<IProject> = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	status: {
		type: String,
		enum: ['active', 'completed', 'on_hold'],
		default: 'active',
	},
	iconName: { type: String, required: true },
	comments: { type: [CommentSchema], default: [] },
	createdAt: { type: Date, default: Date.now },
	deadline: { type: Date, default: null },
});

export default mongoose.model<IProject>('Project', ProjectSchema);
