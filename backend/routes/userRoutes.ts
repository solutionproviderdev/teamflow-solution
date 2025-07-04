// src/routes/users.ts
import express from 'express';
import {
	getAllUsers, // returns User[]
	getUserById, // returns User
	createUser, // creates + returns new User
	updateUser, // updates + returns User
	deleteUser, // deletes + returns { success: true }
} from '../controllers/userController';

const router = express.Router();

// GET    /api/users          -> User[]
router.get('/', getAllUsers);

// GET    /api/users/:id      -> User
router.get('/:id', getUserById);

// POST   /api/users          -> User
router.post('/', createUser);

// PUT    /api/users/:id      -> Partial<User>  -> Updated User
router.put('/:id', updateUser);

// DELETE /api/users/:id      -> { success: true }
router.delete('/:id', deleteUser);

export default router;
