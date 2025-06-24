import React from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProjectGanttChart from '@/components/ProjectGanttChart';
import { User, Task, Project } from '@/types'; // Adjust if you have types

type Props = {
	project: Project;
	tasks: Task[];
	users: User[];
};

const ProjectOverviewTab: React.FC<Props> = ({ project, tasks, users }) => {
	const projectManager = users.find(user => user.id === project.managerId);

	return (
		<div className="space-y-4">
			<ProjectGanttChart tasks={tasks} />

			<Card>
				<CardHeader>
					<CardTitle>Project Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="text-sm font-medium text-muted-foreground mb-1">
							Description
						</h3>
						<p className="text-sm">{project.description}</p>
					</div>

					<Separator />

					<div>
						<h3 className="text-sm font-medium text-muted-foreground mb-2">
							Project Manager
						</h3>
						{projectManager ? (
							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8">
									<AvatarFallback>
										{projectManager.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-medium">{projectManager.name}</p>
									<p className="text-xs text-muted-foreground">
										{projectManager.email}
									</p>
								</div>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								No manager assigned
							</p>
						)}
					</div>

					<Separator />

					<div>
						<h3 className="text-sm font-medium text-muted-foreground mb-2">
							Team Members
						</h3>
						{project.members && project.members.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{project.members.map(memberId => {
									const member = users.find(u => u.id === memberId);
									return member ? (
										<div
											key={member.id}
											className="flex items-center gap-2 bg-secondary/50 rounded-md p-2"
										>
											<Avatar className="h-6 w-6">
												<AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<span className="text-sm">{member.name}</span>
										</div>
									) : null;
								})}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								No team members assigned
							</p>
						)}
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<h3 className="text-sm font-medium text-muted-foreground mb-1">
								Created
							</h3>
							<p className="text-sm">
								{format(new Date(project.createdAt), 'MMM d, yyyy')}
							</p>
						</div>

						{project.deadline && (
							<div>
								<h3 className="text-sm font-medium text-muted-foreground mb-1">
									Deadline
								</h3>
								<p className="text-sm">
									{format(new Date(project.deadline), 'MMM d, yyyy')}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProjectOverviewTab;
