// src/routes/projects.ts
import express from 'express';
import {
	getAllProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	addProjectComment,
} from '../controllers/projectController';

const router = express.Router();

// GET    /api/projects                   → Project[]
router.get('/', getAllProjects);

// GET    /api/projects/:projectId        → Project
router.get('/:projectId', getProjectById);

// POST   /api/projects                   → Created Project
router.post('/', createProject);

// PUT    /api/projects/:projectId        → Updated Project
router.put('/:projectId', updateProject);

// DELETE /api/projects/:projectId        → { success: true }
router.delete('/:projectId', deleteProject);

// POST   /api/projects/:projectId/comment → Updated Project with new comment
router.post('/:projectId/comment', addProjectComment);

export default router;
