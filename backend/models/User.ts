// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	passwordHash: string;
	role: 'admin' | 'worker';
	jobTitle: string;
	iconName: string;
	avatarUrl?: string;
	createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['admin', 'worker'], default: 'worker' },
		jobTitle: { type: String, required: true },
		iconName: { type: String, },
		avatarUrl: { type: String },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: false }
);

export default mongoose.model<IUser>('User', UserSchema);
