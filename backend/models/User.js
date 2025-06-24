const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true, minlength: 2 },
		email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
		jobTitle: { type: String },
		role: { type: String, enum: ['admin', 'worker'], required: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
