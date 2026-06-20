const clients = [
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

const projects = [
  {
    id: 101,
    name: 'Website redesign',
    client: 'Northstar Studio',
    status: 'In Progress',
    dueDate: 'Jul 12, 2026',
    progress: 68
  },
  {
    id: 102,
    name: 'Launch campaign',
    client: 'BrightPath Coaching',
    status: 'Planning',
    dueDate: 'Jul 24, 2026',
    progress: 25
  },
  {
    id: 103,
    name: 'Monthly retainer',
    client: 'Harbor Legal Group',
    status: 'Review',
    dueDate: 'Jun 28, 2026',
    progress: 82
  },
  {
    id: 104,
    name: 'Client portal refresh',
    client: 'Summit Fitness Co.',
    status: 'Completed',
    dueDate: 'Jun 2, 2026',
    progress: 100
  }
];

const tasks = [
  {
    id: 201,
    title: 'Send homepage mockups',
    project: 'Website redesign',
    assignee: 'Avery Brooks',
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Jun 21, 2026'
  },
  {
    id: 202,
    title: 'Review onboarding copy',
    project: 'Launch campaign',
    assignee: 'Mina Patel',
    priority: 'Medium',
    status: 'Todo',
    dueDate: 'Jun 24, 2026'
  },
  {
    id: 203,
    title: 'Prepare monthly report',
    project: 'Monthly retainer',
    assignee: 'Noah Kim',
    priority: 'Low',
    status: 'Completed',
    dueDate: 'Jun 18, 2026'
  },
  {
    id: 204,
    title: 'QA client portal updates',
    project: 'Client portal refresh',
    assignee: 'Avery Brooks',
    priority: 'High',
    status: 'Todo',
    dueDate: 'Jun 26, 2026'
  }
];

module.exports = { clients, projects, tasks };
