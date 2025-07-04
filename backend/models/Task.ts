// src/models/Task.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Comment {
	id: string;
	content: string;
	authorId: mongoose.Types.ObjectId;
	createdAt: Date;
}

export interface ITask extends Document {
	title: string;
	description: string;
	projectId: mongoose.Types.ObjectId;
	assigneeId?: mongoose.Types.ObjectId | null;
	status: 'todo' | 'in_progress' | 'on_hold' | 'blocked' | 'completed';
	priority: 'low' | 'medium' | 'high';
	deadline?: Date | null;
	iconName: string;
	comments: Comment[];
	createdAt: Date;
	startedAt?: Date | null;
	completedAt?: Date | null;
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

const TaskSchema: Schema<ITask> = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
	assigneeId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
	status: {
		type: String,
		enum: ['todo', 'in_progress', 'on_hold', 'blocked', 'completed'],
		default: 'todo',
	},
	priority: {
		type: String,
		enum: ['low', 'medium', 'high'],
		default: 'medium',
	},
	deadline: { type: Date, default: null },
	iconName: { type: String, required: true },
	comments: { type: [CommentSchema], default: [] },
	createdAt: { type: Date, default: Date.now },
	startedAt: { type: Date, default: null },
	completedAt: { type: Date, default: null },
});

export default mongoose.model<ITask>('Task', TaskSchema);
