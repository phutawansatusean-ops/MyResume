import { Project } from '../types/project'

/** Starter projects. The admin dashboard can import these into Realtime Database (they are also the fallback while Firebase is not configured). */
export const initialProjects: Omit<Project, 'order'>[] = [
  {
    id: 'greentwin-ai',
    title: 'GreenTwin AI',
    description: 'AI Digital Twin for Sustainable Campus',
    category: 'AI / Data',
    image: { gradient: ['#1B3A2F', '#0E1B16'], icon: 'Leaf' },
    technologies: ['Python', 'AI', 'Data Analysis'],
    projectUrl: '',
    githubUrl: '',
    featured: true,
    details: {
      problem:
        'University campuses consume large amounts of energy and water with little visibility into where waste actually happens, making it hard to plan sustainability improvements.',
      solution:
        'A digital twin that mirrors campus energy, water, and waste systems in real time, using sensor and utility data to simulate the impact of changes before they are made.',
      features: [
        'Live simulation of energy and water flow across campus buildings',
        'Predictive models for consumption spikes and equipment failure',
        'Scenario testing for solar panels, retrofits, and green spaces',
        'Dashboard for facilities staff with plain-language recommendations',
      ],
      myRole:
        'Designed the data pipeline and trained the forecasting models, and built the simulation dashboard end to end.',
    },
  },
  {
    id: 'farm2loop-ai',
    title: 'FARM2LOOP AI',
    description: 'AI B2B food supply-chain platform',
    category: 'AI / Data',
    image: { gradient: ['#2E2412', '#170F08'], icon: 'Wheat' },
    technologies: ['Web App', 'AI', 'Supply Chain'],
    projectUrl: '',
    githubUrl: '',
    featured: true,
    details: {
      problem:
        'Small and mid-size farms struggle to find reliable B2B buyers, leading to unsold surplus and unpredictable income.',
      solution:
        'A matching platform that connects farms directly with restaurants and retailers, using demand forecasting to route surplus produce before it spoils.',
      features: [
        'AI-matched buyer and seller recommendations',
        'Demand forecasting based on seasonal and regional trends',
        'Order tracking from harvest to delivery',
        'Price transparency tools for both sides of the trade',
      ],
      myRole:
        'Led product design and built the recommendation engine that pairs supply with demand.',
    },
  },
  {
    id: 'mindcare',
    title: 'MindCare',
    description: 'AI mental-health app for Gen Z',
    category: 'AI / Data',
    image: { gradient: ['#241B33', '#120F1C'], icon: 'HeartHandshake' },
    technologies: ['Flutter', 'AI', 'UX/UI'],
    projectUrl: '',
    githubUrl: '',
    featured: true,
    details: {
      problem:
        'Many young people hesitate to seek mental health support because of stigma, cost, or simply not knowing where to start.',
      solution:
        'A mobile-first companion app that offers private mood tracking, guided check-ins, and gentle nudges toward professional help when patterns suggest it is needed.',
      features: [
        'Daily mood and journal check-ins with pattern recognition',
        'Conversational check-in flow tuned for a younger audience',
        'Resource library organized by topic and urgency',
        'Private by default, with no data shared without consent',
      ],
      myRole:
        'Designed the UX research and interface, and implemented the Flutter front end.',
    },
  },
  {
    id: 'my-school',
    title: 'My School',
    description: 'A school portal for students to track classes, grades, and announcements.',
    category: 'Web Development',
    image: { gradient: ['#132436', '#0A121C'], icon: 'GraduationCap' },
    technologies: ['Flutter', 'Web App'],
    projectUrl: '',
    githubUrl: '',
    featured: false,
    details: {
      problem: 'Students had to check multiple disconnected channels for schedules, grades, and school announcements.',
      solution: 'A single portal that unifies the class schedule, grade reports, and announcements in one place.',
      features: ['Class schedule view', 'Grade history', 'Announcement feed', 'Cross-platform Flutter build'],
      myRole: 'Built the full app independently as a school project.',
    },
  },
  {
    id: 'arduino-projects',
    title: 'Arduino Projects',
    description: 'A collection of embedded systems experiments and small robotics builds.',
    category: 'Hardware',
    image: { gradient: ['#2A1B12', '#150E09'], icon: 'CircuitBoard' },
    technologies: ['Arduino', 'C++'],
    projectUrl: '',
    githubUrl: '',
    featured: false,
    details: {
      problem: 'Wanted a hands-on way to learn embedded programming and circuit design beyond simulations.',
      solution: 'A series of small builds covering sensors, motors, and basic automation logic.',
      features: ['Sensor-driven automation', 'Motor control circuits', 'Custom PCB wiring', 'C++ firmware'],
      myRole: 'Designed, wired, and programmed each build from scratch.',
    },
  },
  {
    id: 'blender-3d',
    title: 'Blender 3D',
    description: 'A set of 3D modeling and rendering studies exploring lighting and form.',
    category: 'Design',
    image: { gradient: ['#241A2E', '#130D19'], icon: 'Box' },
    technologies: ['Blender', '3D Design'],
    projectUrl: '',
    githubUrl: '',
    featured: false,
    details: {
      problem: 'Wanted to build spatial and visual design skills outside of code.',
      solution: 'A series of 3D scenes exploring modeling, lighting, and material work.',
      features: ['Hard-surface modeling', 'Studio lighting setups', 'Procedural materials', 'Render optimization'],
      myRole: 'Modeled, lit, and rendered every scene independently.',
    },
  },
  {
    id: 'environmental-innovation',
    title: 'Environmental Innovation',
    description: 'Research on low-cost water filtration methods for rural communities.',
    category: 'Design',
    image: { gradient: ['#122A22', '#091712'], icon: 'FlaskConical' },
    technologies: ['Research', 'Sustainability'],
    projectUrl: '',
    githubUrl: '',
    featured: false,
    details: {
      problem: 'Rural communities near campus lacked access to affordable, reliable water filtration.',
      solution: 'Research into low-cost filtration materials, tested for feasibility and effectiveness.',
      features: ['Material feasibility testing', 'Cost comparison study', 'Field data collection', 'Written research report'],
      myRole: 'Conducted the research and authored the final report.',
    },
  },
]
