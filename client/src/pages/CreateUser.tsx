import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAddUserMutation } from '@/store/api/api';
import { Link } from 'react-router-dom';

const commonIconNames = [
	'briefcase',
	'clipboard',
	'check-circle',
	'calendar',
	'clock',
	'code',
	'cog',
	'database',
	'file',
	'folder',
	'globe',
	'home',
	'image',
	'layers',
	'layout',
	'list',
	'mail',
	'message-square',
	'monitor',
	'pen-tool',
	'pie-chart',
	'plus',
	'settings',
	'star',
	'terminal',
	'thumbs-up',
	'tool',
	'trash-2',
	'trending-up',
	'user',
	'users',
	'zap',
	'shield',
	'target',
	'flag',
	'bookmark',
	'lightbulb',
	'archive',
	'book-open',
	'file-text',
	'phone',
	'map',
	'camera',
	'award',
];

const CreateUser: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<'admin' | 'worker'>('worker');
	const [password, setPassword] = useState('');
	const [jobTitle, setJobTitle] = useState('');
	const [iconName, setIconName] = useState(commonIconNames[0]);
	const [avatarUrl, setAvatarUrl] = useState('');
	const [addUser, { isLoading }] = useAddUserMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email || !password || !jobTitle || !iconName) {
			toast({ title: 'All fields required', variant: 'destructive' });
			return;
		}
		try {
			await addUser({
				name,
				email,
				password,
				role,
				jobTitle,
				iconName,
				avatarUrl: avatarUrl || undefined,
			}).unwrap();
			toast({ title: 'User created', description: `${name} was added!` });
			setName('');
			setEmail('');
			setPassword('');
			setRole('worker');
			setJobTitle('');
			setIconName(commonIconNames[0]);
			setAvatarUrl('');
		} catch (err: any) {
			toast({
				title: 'Create failed',
				description: err?.data?.message || 'Could not create user',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Card className="glass-card shadow-xl">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl text-center">Create User</CardTitle>
						<CardDescription className="text-center">
							Add a new user to the system
						</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="jobTitle">Job Title</Label>
								<Input
									id="jobTitle"
									value={jobTitle}
									onChange={e => setJobTitle(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<select
									id="role"
									value={role}
									onChange={e => setRole(e.target.value as 'admin' | 'worker')}
									className="w-full p-2 border rounded"
								>
									<option value="worker">Worker</option>
									<option value="admin">Admin</option>
								</select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="iconName">Icon</Label>
								<select
									id="iconName"
									value={iconName}
									onChange={e => setIconName(e.target.value)}
									className="w-full p-2 border rounded"
								>
									{commonIconNames.map(icon => (
										<option key={icon} value={icon}>
											{icon}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="avatarUrl">
									Avatar URL{' '}
									<span className="text-xs text-muted-foreground">
										(optional)
									</span>
								</Label>
								<Input
									id="avatarUrl"
									value={avatarUrl}
									onChange={e => setAvatarUrl(e.target.value)}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? 'Creating...' : 'Create User'}
							</Button>
						</CardFooter>
						<Link to="/login">
							<button className="btn btn-primary">go back to login</button>
						</Link>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default CreateUser;
