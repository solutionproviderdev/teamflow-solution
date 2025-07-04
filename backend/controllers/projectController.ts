// src/controllers/projectController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project, { IProject, Comment as IComment } from '../models/Project';

// GET /api/projects → Project[]
export const getAllProjects = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const projects: IProject[] = await Project.find().lean();
		res.json(projects);
	} catch (err) {
		console.error('getAllProjects error:', err);
		res.status(500).json({ message: 'Failed to fetch projects' });
	}
};

// GET /api/projects/:projectId → Project
export const getProjectById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const project = await Project.findById(req.params.projectId).lean();
		if (!project) {
			res.status(404).json({ message: 'Project not found' });
			return;
		}
		res.json(project);
	} catch (err) {
		console.error('getProjectById error:', err);
		res.status(500).json({ message: 'Error fetching project' });
	}
};

// POST /api/projects → Created Project
export const createProject = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const payload = req.body as Partial<IProject>;
		const newProject = new Project({
			...payload,
			comments: [], // start with no comments
			createdAt: new Date(),
			deadline: payload.deadline ?? null,
		});
		await newProject.save();
		res.status(201).json(newProject);
	} catch (err) {
		console.error('createProject error:', err);
		res.status(400).json({ message: 'Project creation failed' });
	}
};

// PUT /api/projects/:projectId → Updated Project
export const updateProject = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const updates = req.body as Partial<IProject>;
		const updated = await Project.findByIdAndUpdate(
			req.params.projectId,
			updates,
			{ new: true }
		).lean();
		if (!updated) {
			res.status(404).json({ message: 'Project not found' });
			return;
		}
		res.json(updated);
	} catch (err) {
		console.error('updateProject error:', err);
		res.status(400).json({ message: 'Project update failed' });
	}
};

// DELETE /api/projects/:projectId → { success: true }
export const deleteProject = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const result = await Project.findByIdAndDelete(req.params.projectId);
		if (!result) {
			res.status(404).json({ message: 'Project not found' });
			return;
		}
		res.json({ success: true });
	} catch (err) {
		console.error('deleteProject error:', err);
		res.status(400).json({ message: 'Project deletion failed' });
	}
};

// POST /api/projects/:projectId/comment → Updated Project with new comment
export const addProjectComment = async (
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
		const updated = await Project.findByIdAndUpdate(
			req.params.projectId,
			{ $push: { comments: comment } },
			{ new: true }
		).lean();
		if (!updated) {
			res.status(404).json({ message: 'Project not found' });
			return;
		}
		res.json(updated);
	} catch (err) {
		console.error('addProjectComment error:', err);
		res.status(400).json({ message: 'Adding comment failed' });
	}
};
