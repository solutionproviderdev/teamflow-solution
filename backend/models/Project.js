const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		status: {
			type: String,
			enum: ['pending', 'in_progress', 'completed'],
			default: 'pending',
		},
		deadline: { type: Date },
		projectManager: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
