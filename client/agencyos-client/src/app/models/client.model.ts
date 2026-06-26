export type ClientStatus = 'Active' | 'Onboarding' | 'Paused';

export type Client = {
  _id?: string;
  id: number;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  activeProjects: number;
  lastContact: string;
  createdAt?: string;
  updatedAt?: string;
};
