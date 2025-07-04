import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // assume IUser interface on the model
import { clearScreenDown } from 'readline';
import bcrypt from 'bcryptjs';


// GET /api/users → User[]
export const getAllUsers = async (req: Request, res: Response) => {
	console.log('teremer nam mrepiyaa!')
	try {
		const users: IUser[] = await User.find().lean();
		res.json(users);
	} catch (err) {
		console.error('getAllUsers error:', err);
		res.status(500).json({ message: 'Failed to fetch users' });
	}
};

// GET /api/users/:id → User
export const getUserById = async (req: Request, res: Response) => {
	try {
		const user: IUser | null = await User.findById(req.params.id).lean();
		if (!user) {
			 res.status(404).json({ message: 'User not found' });
			 return;
		}
		res.json(user);
	} catch (err) {
		console.error('getUserById error:', err);
		res.status(500).json({ message: 'Error fetching user' });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password, role, jobTitle, iconName, avatarUrl } =
			req.body;

		if (!password) {
			res.status(400).json({ message: 'Password is required' });
			return;
		}
		// 🔴 Check for existing user first!
		const existing = await User.findOne({ email });
		if (existing) {
			return res
				.status(400)
				.json({ message: 'Email already exists. Please use another.' });
		}
		const passwordHash = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			passwordHash, // Store hashed password!
			role,
			jobTitle,
			iconName,
			avatarUrl,
		});

		await newUser.save();

		// Remove passwordHash from response
		const userObj = newUser.toObject();
		console.log('newuser with hashed password!', userObj);
		delete userObj.passwordHash;

		console.log('second for  password!', userObj);
		res.status(201).json(userObj);
	} catch (err) {
		console.error('createUser error:', err);
		res.status(400).json({ message: 'User creation failed' });
	}
};

// PUT /api/users/:id → Updated User
export const updateUser = async (req: Request, res: Response) => {
	try {
		const updates = req.body as Partial<IUser>;
		const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
			new: true,
		}).lean();
		if (!updatedUser) {
			 res.status(404).json({ message: 'User not found' });
			 return;
		}
		res.json(updatedUser);
	} catch (err) {
		console.error('updateUser error:', err);
		res.status(400).json({ message: 'User update failed' });
	}
};

// DELETE /api/users/:id → { success: true }
export const deleteUser = async (req: Request, res: Response) => {
	try {
		const result = await User.findByIdAndDelete(req.params.id);
		if (!result) {
			 res.status(404).json({ message: 'User not found' });
			 return;
		}
		res.json({ success: true });
	} catch (err) {
		console.error('deleteUser error:', err);
		res.status(400).json({ message: 'User deletion failed' });
	}
};
