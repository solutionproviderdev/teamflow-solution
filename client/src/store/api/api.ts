// src/store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateUserInput, Project, Task, User } from '../types';
  

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:5000',
		prepareHeaders: headers => {
			const token = localStorage.getItem('token');
			if (token) headers.set('authorization', `Bearer ${token}`);
			return headers;
		},
	}),
	tagTypes: ['Auth', 'User', 'Project', 'Task'],
	endpoints: () => ({}),
});

/** Auth Endpoints */
export const authApi = api.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<
			{ token: string; user: User },
			{ email: string; password: string }
		>({
			query: creds => ({ url: '/api/auth/login', method: 'POST', body: creds }),
			invalidatesTags: ['Auth'],
		}),
		logout: builder.mutation<{ success: boolean }, void>({
			query: () => ({ url: '/api/auth/logout', method: 'POST' }),
			invalidatesTags: ['Auth'],
		}),
		me: builder.query<{ user: User }, void>({
			query: () => '/api/auth/me',
			providesTags: ['Auth'],
		}),
	}),
});

/** User Endpoints */
export const userApi = api.injectEndpoints({
	endpoints: builder => ({
		fetchUsers: builder.query<User[], void>({
			query: () => '/api/users',
			providesTags: ['User'],
		}),
		fetchUser: builder.query<User, string>({
			query: id => `/api/users/${id}`,
			providesTags: (result, error, id) => [{ type: 'User', id }],
		}),
		addUser: builder.mutation<User, CreateUserInput>({
			query: user => ({
				url: '/api/user',
				method: 'POST',
				body: user,
			}),
			invalidatesTags: ['User'],
		}),
		updateUser: builder.mutation<User, { id: string; changes: Partial<User> }>({
			query: ({ id, changes }) => ({
				url: `/api/users/${id}`,
				method: 'PUT',
				body: changes,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
		}),
		deleteUser: builder.mutation<{ success: boolean }, string>({
			query: id => ({ url: `/api/users/${id}`, method: 'DELETE' }),
			invalidatesTags: ['User'],
		}),
	}),
});

/** Project Endpoints */
export const projectApi = api.injectEndpoints({
	endpoints: builder => ({
		fetchProjects: builder.query<Project[], void>({
			query: () => '/api/projects',
			providesTags: ['Project'],
		}),
		fetchProject: builder.query<Project, string>({
			query: id => `/api/projects/${id}`,
			providesTags: (result, error, id) => [{ type: 'Project', id }],
		}),
		addProject: builder.mutation<Project, Partial<Project>>({
			query: data => ({ url: '/api/projects', method: 'POST', body: data }),
			invalidatesTags: ['Project'],
		}),
		updateProject: builder.mutation<
			Project,
			{ id: string; changes: Partial<Project> }
		>({
			query: ({ id, changes }) => ({
				url: `/api/projects/${id}`,
				method: 'PUT',
				body: changes,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
		}),
		deleteProject: builder.mutation<{ success: boolean }, string>({
			query: id => ({ url: `/api/projects/${id}`, method: 'DELETE' }),
			invalidatesTags: ['Project'],
		}),
		addComment: builder.mutation<
			Project,
			{ projectId: string; content: string; authorId: string }
		>({
			query: ({ projectId, content, authorId }) => ({
				url: `/api/projects/${projectId}/comment`,
				method: 'POST',
				body: { content, authorId },
			}),
			invalidatesTags: (result, error, { projectId }) => [
				{ type: 'Project', id: projectId },
			],
		}),
	}),
});

/** Task Endpoints */
export const taskApi = api.injectEndpoints({
	endpoints: builder => ({
		fetchTasks: builder.query<Task[], void>({
			query: () => '/api/tasks',
			providesTags: ['Task'],
		}),
		fetchTask: builder.query<Task, string>({
			query: id => `/api/tasks/${id}`,
			providesTags: (result, error, id) => [{ type: 'Task', id }],
		}),
		addTask: builder.mutation<Task, Partial<Task>>({
			query: data => ({ url: '/api/tasks', method: 'POST', body: data }),
			invalidatesTags: ['Task'],
		}),
		updateTask: builder.mutation<Task, { id: string; changes: Partial<Task> }>({
			query: ({ id, changes }) => ({
				url: `/api/tasks/${id}`,
				method: 'PUT',
				body: changes,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
		}),
		deleteTask: builder.mutation<{ success: boolean }, string>({
			query: id => ({ url: `/api/tasks/${id}`, method: 'DELETE' }),
			invalidatesTags: ['Task'],
		}),
		addComment: builder.mutation<
			Task,
			{ taskId: string; content: string; authorId: string }
		>({
			query: ({ taskId, content, authorId }) => ({
				url: `/api/tasks/${taskId}/comment`,
				method: 'POST',
				body: { content, authorId },
			}),
			invalidatesTags: (result, error, { taskId }) => [
				{ type: 'Task', id: taskId },
			],
		}),
		assignTask: builder.mutation<Task, { taskId: string; userId: string }>({
			query: ({ taskId, userId }) => ({
				url: `/api/tasks/${taskId}/assign`,
				method: 'PATCH',
				body: { userId },
			}),
			invalidatesTags: (result, error, { taskId }) => [
				{ type: 'Task', id: taskId },
			],
		}),
		updateStatus: builder.mutation<
			Task,
			{ taskId: string; status: Task['status'] }
		>({
			query: ({ taskId, status }) => ({
				url: `/api/tasks/${taskId}/status`,
				method: 'PATCH',
				body: { status },
			}),
			invalidatesTags: (result, error, { taskId }) => [
				{ type: 'Task', id: taskId },
			],
		}),
	}),
});

/** Export Hooks */
export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;

export const {
	useFetchUsersQuery,
	useFetchUserQuery,
	useAddUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = userApi;

export const {
	useFetchProjectsQuery,
	useFetchProjectQuery,
	useAddProjectMutation,
	useUpdateProjectMutation,
	useDeleteProjectMutation,
	useAddCommentMutation,
} = projectApi;

export const {
	useFetchTasksQuery,
	useFetchTaskQuery,
	useAddTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
	useAddCommentMutation: useAddTaskCommentMutation,
	useAssignTaskMutation,
	useUpdateStatusMutation,
} = taskApi;
