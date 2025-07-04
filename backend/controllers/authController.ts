import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Create & return a new User
export const createUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// assume req.body matches your IUser schema
		const newUser: IUser = new User(req.body);
		await newUser.save();
		res.status(201).json(newUser);
	} catch (err) {
		console.error('createUser error:', err);
		res.status(400).json({ message: 'User creation failed' });
	}
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).json({ message: 'Email and password required.' });
		return;
	}

	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
		res.status(401).json({ message: 'Invalid email or password.' });
		return;
	}
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not set in env!');
	}
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});
	  
	// Optionally set as cookie:
	res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

	res.json({
		token,
		user: { id: user.id, name: user.name, email: user.email, role: user.role },
	});
};

// POST /api/auth/logout
export const logout = (_req: Request, res: Response) => {
	// If using cookies:
	// res.clearCookie('token');
	res.json({ success: true });
};

// GET /api/auth/me
export const me = async (req: Request, res: Response) => {
	// Expect: Authorization: Bearer <token>
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		res.status(401).json({ message: 'Not authenticated.' });
		return;
	}

	const token = authHeader.split(' ')[1];
	try {
		const payload = jwt.verify(token, JWT_SECRET) as { id: string };
		const user = await User.findById(payload.id).lean();
		if (!user) {
			res.status(404).json({ message: 'User not found.' });
			return;
		}

		res.json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch {
		res.status(401).json({ message: 'Invalid or expired token.' });
		return;
	}
};
