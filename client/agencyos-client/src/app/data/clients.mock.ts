export type ClientStatus = 'Active' | 'Onboarding' | 'Paused';

export type Client = {
  id: number;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  activeProjects: number;
  lastContact: string;
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'Maya Chen',
    company: 'Northstar Studio',
    email: 'maya@northstar.example',
    status: 'Active',
    activeProjects: 3,
    lastContact: 'Jun 10, 2026'
  },
  {
    id: 2,
    name: 'Jordan Ellis',
    company: 'BrightPath Coaching',
    email: 'jordan@brightpath.example',
    status: 'Onboarding',
    activeProjects: 2,
    lastContact: 'Jun 8, 2026'
  },
  {
    id: 3,
    name: 'Priya Raman',
    company: 'Harbor Legal Group',
    email: 'priya@harborlegal.example',
    status: 'Active',
    activeProjects: 1,
    lastContact: 'Jun 4, 2026'
  },
  {
    id: 4,
    name: 'Marcus Lee',
    company: 'Summit Fitness Co.',
    email: 'marcus@summitfitness.example',
    status: 'Paused',
    activeProjects: 0,
    lastContact: 'May 29, 2026'
  }
];
