import { SubjectItem } from '../types/content';

export const PLATFORM_SUBJECTS: SubjectItem[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    slug: 'data-structures-algorithms',
    iconName: 'Binary',
    description: 'Arrays, Trees, Graphs, Sorting, Dynamic Programming & Complexity Analysis',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'dbms',
    name: 'DBMS & SQL',
    slug: 'dbms-sql',
    iconName: 'Database',
    description: 'Relational Models, Normalization, SQL Queries, Indexing & Transactions',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'os',
    name: 'Operating Systems',
    slug: 'operating-systems',
    iconName: 'Cpu',
    description: 'Processes, Threads, CPU Scheduling, Deadlocks & Virtual Memory Management',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    slug: 'computer-networks',
    iconName: 'Network',
    description: 'OSI 7 Layers, TCP/IP, IP Subnetting, Routing Protocols & Sockets',
    color: 'from-sky-500 to-cyan-600',
  },
  {
    id: 'python',
    name: 'Python Programming',
    slug: 'python-programming',
    iconName: 'Code',
    description: 'Python Basics, OOPs, Data Structures, Standard Libraries & Scripting',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'java',
    name: 'Java Core & OOPs',
    slug: 'java-core-oops',
    iconName: 'Coffee',
    description: 'Core Java, Classes, Inheritance, Collections Framework & Multithreading',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'webdev',
    name: 'Web Development',
    slug: 'web-development',
    iconName: 'Globe',
    description: 'HTML5/CSS3, JavaScript, React, Node.js, REST APIs & Full Stack Apps',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'aiml',
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    iconName: 'Sparkles',
    description: 'Supervised Learning, Neural Networks, Deep Learning & Model Evaluation',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'math',
    name: 'Engineering Mathematics',
    slug: 'engineering-mathematics',
    iconName: 'Calculator',
    description: 'Linear Algebra, Multivariable Calculus, Differential Equations & Probability',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'physics',
    name: 'Engineering Physics & Mechanics',
    slug: 'physics-mechanics',
    iconName: 'Zap',
    description: 'Rotational Dynamics, Electromagnetism, Quantum Mechanics & Wave Optics',
    color: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'se',
    name: 'Software Engineering',
    slug: 'software-engineering',
    iconName: 'FileCode2',
    description: 'SDLC, Agile Scrum, Design Patterns, Testing & Git Version Control',
    color: 'from-emerald-400 to-cyan-600',
  },
];

export const getSubjectById = (id: string): SubjectItem | undefined => {
  return PLATFORM_SUBJECTS.find(
    (s) => s.id.toLowerCase() === id.toLowerCase() || s.name.toLowerCase() === id.toLowerCase()
  );
};

export const getSubjectNameById = (id: string): string => {
  const subject = getSubjectById(id);
  return subject ? subject.name : id;
};
