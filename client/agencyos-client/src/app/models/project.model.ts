export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Completed';

export type Project = {
  _id?: string;
  id: number;
  name: string;
  client: string;
  status: ProjectStatus;
  dueDate: string;
  progress: number;
};
