const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		status: {
			type: String,
			enum: ['todo', 'in_progress', 'done'],
			default: 'todo',
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high'],
			default: 'medium',
		},
		deadline: { type: Date },
		project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
		assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
