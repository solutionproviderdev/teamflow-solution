// src/routes/tasks.ts
import express from 'express';
import {
	getAllTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
	addTaskComment,
	updateTaskAssignee,
	updateTaskStatus,
} from '../controllers/taskController';

const router = express.Router();

// GET    /api/tasks                      → Task[]
router.get('/', getAllTasks);

// GET    /api/tasks/:taskId              → Task
router.get('/:taskId', getTaskById);

// POST   /api/tasks                      → Created Task
router.post('/', createTask);

// PUT    /api/tasks/:taskId              → Updated Task
router.put('/:taskId', updateTask);

// DELETE /api/tasks/:taskId              → { success: true }
router.delete('/:taskId', deleteTask);

// POST   /api/tasks/:taskId/comment      → Updated Task with new comment
router.post('/:taskId/comment', addTaskComment);

// PATCH  /api/tasks/:taskId/assign       → Updated Task (assignee)
router.patch('/:taskId/assign', updateTaskAssignee);

// PATCH  /api/tasks/:taskId/status       → Updated Task (status & dates)
router.patch('/:taskId/status', updateTaskStatus);

export default router;
