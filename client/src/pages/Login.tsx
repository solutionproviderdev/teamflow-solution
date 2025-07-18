
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { addUser } from '@/store/slices/usersSlice';
import { generateId } from '@/utils/dataUtils';
import { mockUsers, mockProjects, mockTasks } from '@/utils/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { icons } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useLoginMutation } from '@/store/api/api';

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login, { isLoading }] = useLoginMutation();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) return;

		try {
			const data = await login({ email, password }).unwrap();
			console.log('Login successful:', data);
			// Save token (if not handled by RTK Query baseQuery)
			localStorage.setItem('token', data.token);
			toast({
				title: 'Login successful',
				description: `Welcome back, ${data.user.name}!`,
			});
			navigate('/dashboard');
		} catch (err: any) {
			toast({
				title: 'Login failed',
				description: err?.data?.message || 'Invalid email or password.',
				variant: 'destructive',
			});
		}
	};
  
  return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
			<div className="w-full max-w-md animate-fade-in">
				<Card className="glass-card shadow-xl">
					<CardHeader className="space-y-1">
						<div className="mx-auto p-2 rounded-full bg-primary/10 mb-2">
							<h1 className="text-2xl font-bold text-primary text-center">
								Solution Manager
							</h1>
						</div>
						<CardTitle className="text-2xl text-center">Welcome back</CardTitle>
						<CardDescription className="text-center">
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<form onSubmit={handleLogin}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<Button
										type="button"
										variant="link"
										className="px-0 font-normal h-auto text-xs"
										onClick={() =>
											toast({
												description: 'Any password will work for the demo.',
											})
										}
									>
										Forgot password?
									</Button>
								</div>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
								/>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && (
									<svg
										className="mr-2 h-4 w-4 animate-spin"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
								)}
								Sign in
							</Button>
							<Link to="/users/new">
								<button className="btn btn-primary">Create User</button>
							</Link>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default Login;
