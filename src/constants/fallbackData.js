// Static content shown when the matching Firestore collection is empty.
// Add documents to the `challenges` collection in the Firebase console to override these.

export const FALLBACK_CHALLENGES = [
  {
    id: 'chal-1',
    title: 'Glassmorphic SaaS Trading Dashboard',
    description:
      'Design or build an editorial obsidian trading interface for a gold backing token. Highlight key transactional logs, visual charts, and modal sliders.',
    prize: '$250 + Verified UI Badge',
    deadline: '3d 4h 12m',
    active: true,
  },
  {
    id: 'chal-2',
    title: 'Docker Dev Container Orchestration',
    description:
      'Create a docker-compose configuration automating hot-reloads, database migrations, and telemetry triggers in developer setups.',
    prize: '$150 + Dev Credentials',
    winner: 'Nikolai Tesla',
    active: false,
  },
  {
    id: 'chal-3',
    title: 'Technical Writing: Next-Gen API Design',
    description:
      'Write an editorial post detailing why GraphQL subscriptions are losing developer adoption to RPC servers like tRPC.',
    prize: '$100 + Writing Badge',
    winner: 'Elena Rostova',
    active: false,
  },
];

export const MENTORS = [
  { id: 'm-1', name: 'Alex Rivera', specialty: 'React Architecture & AI Integration', rate: 'Free' },
  { id: 'm-2', name: 'Sophia Chen', specialty: 'UI/UX Editorial Figma Architectures', rate: '$80/session' },
  { id: 'm-3', name: 'Devon Carter', specialty: 'Apple SwiftUI Core Animation pipelines', rate: '$120/session' },
  { id: 'm-4', name: 'Priya Nair', specialty: 'AWS Kubernetes Orchestration audits', rate: 'Free' },
];
