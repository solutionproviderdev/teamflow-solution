// src/controllers/taskController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task, { ITask, Comment as IComment } from '../models/Task';

// GET /api/tasks → Task[]
export const getAllTasks = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const tasks: ITask[] = await Task.find().lean();
		res.json(tasks);
	} catch (err) {
		console.error('getAllTasks error:', err);
		res.status(500).json({ message: 'Failed to fetch tasks' });
	}
};

// GET /api/tasks/:taskId → Task
export const getTaskById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const task = await Task.findById(req.params.taskId).lean();
		if (!task) {
			res.status(404).json({ message: 'Task not found' });
			return;
		}
		res.json(task);
	} catch (err) {
		console.error('getTaskById error:', err);
		res.status(500).json({ message: 'Error fetching task' });
	}
};

// POST /api/tasks → Created Task
export const createTask = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const payload = req.body as Partial<ITask>;
		const newTask = new Task({
			...payload,
			comments: [],
			createdAt: new Date(),
			startedAt: null,
			completedAt: null,
		});
		await newTask.save();
		res.status(201).json(newTask);
	} catch (err) {
		console.error('createTask error:', err);
		res.status(400).json({ message: 'Task creation failed' });
	}
};

// PUT /api/tasks/:taskId → Updated Task
export const updateTask = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const updates = req.body as Partial<ITask>;
		const updated = await Task.findByIdAndUpdate(req.params.taskId, updates, {
			new: true,
		}).lean();
		if (!updated) {
			res.status(404).json({ message: 'Task not found' });
			return;
		}
		res.json(updated);
	} catch (err) {
		console.error('updateTask error:', err);
		res.status(400).json({ message: 'Task update failed' });
	}
};

// DELETE /api/tasks/:taskId → { success: true }
export const deleteTask = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const result = await Task.findByIdAndDelete(req.params.taskId);
		if (!result) {
			res.status(404).json({ message: 'Task not found' });
			return;
		}
		res.json({ success: true });
	} catch (err) {
		console.error('deleteTask error:', err);
		res.status(400).json({ message: 'Task deletion failed' });
	}
};

// POST /api/tasks/:taskId/comment → Updated Task with new comment
export const addTaskComment = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { content, authorId } = req.body as {
			content: string;
			authorId: string;
		};
		const comment: IComment = {
			id: new mongoose.Types.ObjectId().toHexString(),
			content,
			authorId: new mongoose.Types.ObjectId(authorId),
			createdAt: new Date(),
		};
		const updated = await Task.findByIdAndUpdate(
			req.params.taskId,
			{ $push: { comments: comment } },
			{ new: true }
		).lean();
		if (!updated) {
			res.status(404).json({ message: 'Task not found' });
			return;
		}
		res.json(updated);
	} catch (err) {
		console.error('addTaskComment error:', err);
		res.status(400).json({ message: 'Adding comment failed' });
	}
};

// PATCH /api/tasks/:taskId/assign → Updated Task (assignee)
export const updateTaskAssignee = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { userId } = req.body as { userId: string };
		const updated = await Task.findByIdAndUpdate(
			req.params.taskId,
			{ assigneeId: new mongoose.Types.ObjectId(userId) },
			{ new: true }
		).lean();
		if (!updated) {
			res.status(404).json({ message: 'Task not found' });
			return;
		}
		res.json(updated);
	} catch (err) {
		console.error('updateTaskAssignee error:', err);
		res.status(400).json({ message: 'Updating assignee failed' });
	}
};

// PATCH /api/tasks/:taskId/status → Updated Task (status & dates)
export const updateTaskStatus = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { status } = req.body as { status: ITask['status'] };
		const updateFields: Partial<ITask> = { status };
		if (status === 'in_progress') updateFields.startedAt = new Date();
		if (status === 'completed') updateFields.completedAt = new Date();

		const updated = await Task.findByIdAndUpdate(
			req.params.taskId,
			updateFields,
			{ new: true }
		).lean();
		if (!updated) {
			res.status(404).json({ message: 'Task not found' });
			return;
		}
		res.json(updated);
	} catch (err) {
		console.error('updateTaskStatus error:', err);
		res.status(400).json({ message: 'Updating status failed' });
	}
};
