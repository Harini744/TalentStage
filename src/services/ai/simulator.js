/**
 * Local, deterministic-ish stand-in for Claude. Used whenever the user hasn't
 * supplied an API key so every AI feature stays usable.
 */

const SIMULATED_DELAY_MS = 1200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));

export function simulateMatch({ skills = [], budget = 0, freelancers = [] }) {
  const matches = freelancers
    .map((fl) => {
      const flSkills = fl.skills ?? [];
      const overlap = flSkills.filter((s) => skills.includes(s));
      let score = 50 + overlap.length * 12;
      score += fl.hourlyRate * 15 <= budget ? 15 : -10;
      score += ((fl.rating || 4) - 4) * 10;
      score = Math.max(1, Math.min(Math.round(score), 99));

      let reasoning = `Overlap on ${overlap.join(', ') || 'core skillsets'}. ${
        fl.hourlyRate * 15 <= budget ? 'Fits within the project budget.' : 'May stretch the project budget.'
      }`;
      if (fl.proMember) reasoning = `[Pro Member] ${reasoning}`;
      return { freelancerId: fl.id, matchScore: score, reasoning };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return delay({ matches });
}

export function simulateEvaluation({ proposals = [] }) {
  const evaluations = proposals.map((p) => {
    const relevance = Math.floor(Math.random() * 3) + 8;
    const clarity = Math.floor(Math.random() * 3) + 7;
    const valueForMoney = Math.floor(Math.random() * 4) + 6;
    const totalScore = relevance + clarity + valueForMoney;
    return {
      proposalId: p.id,
      relevance,
      clarity,
      valueForMoney,
      totalScore,
      recommendation:
        (p.cover?.length ?? 0) > 100
          ? 'Thorough scope outline. Demonstrates outstanding portfolio credentials.'
          : 'Good bid, but could expand more on exact deliverables and workflow.',
      shortlist: totalScore >= 23,
    };
  });
  return delay({ evaluations });
}

export function simulatePortfolioReview({ portfolio = [] }) {
  const overallScore = portfolio.length === 0 ? 30 : Math.min(60 + portfolio.length * 10, 95);
  return delay({
    overallScore,
    strengths: [
      'Nice separation of tech badges',
      portfolio.length > 0 ? 'Strong display of portfolio links' : 'Clean template layout',
    ],
    improvements: [
      {
        area: 'Project Descriptions',
        issue: 'Somewhat terse outlines',
        suggestion: 'Explain deliverables and the client problems you resolved.',
        priority: 'high',
      },
      {
        area: 'Source Code Verification',
        issue: 'Missing git repositories',
        suggestion: 'Add GitHub links to all listed work items.',
        priority: 'medium',
      },
    ],
    missingElements: ['Client testimonial quotes', 'Detailed project process walkthroughs'],
  });
}

export function simulateSkillTest({ skill }) {
  const mcq = (q, options, answer) => ({ q, options, answer, type: 'mcq' });
  return delay({
    questions: [
      mcq(`What is the core performance benefit of virtual rendering in ${skill}?`, ['Recreating entire DOM logs', 'Drawing only elements within view margins', 'Accelerating garbage collections', 'Bypassing GPU compilation'], 'B'),
      mcq(`Which architecture paradigm best handles highly asynchronous mutations of ${skill} structures?`, ['Global reactive state models', 'Direct state variables injection', 'CSS inline stylesheets mappings', 'File System synchronous blocks'], 'A'),
      mcq('How do you enforce security and avoid memory leaks inside continuous listening processes?', ['Ignoring unsubscribe triggers', 'Invoking cancellation triggers inside cleanup routines', 'Increasing browser cache bounds', 'Using setTimeout continuously'], 'B'),
      mcq(`What does high-performance scaling of ${skill} applications require?`, ['Massive recursive loops', 'Clean component separation and memoized structures', 'Relying on standard body tags styles', 'Loading large image assets in-memory'], 'B'),
      mcq(`How are custom layout animations ideally executed in ${skill}?`, ['CSS keyframes paired with hardware acceleration tags', 'Blocking Javascript timers', 'Re-mounting DOM nodes hourly', 'Forcing browser window page refreshes'], 'A'),
      mcq(`What is a common pitfall of un-optimized build bundlers for ${skill}?`, ['Large unused JS files loading concurrently', 'Automatic server failure alerts', 'Direct API key encryptions', 'Muted theme stylesheets'], 'A'),
      mcq(`Which pattern optimizes modular, reusable UI parts in ${skill}?`, ['Encapsulating props interface and state separation', 'Writing a single large file index', 'Using absolute local paths only', 'Hardcoding custom colors values'], 'A'),
      mcq(`How do you handle error boundaries inside production-grade ${skill} systems?`, ['Catching stack exceptions and outputting fallback visuals', 'Forcing app page crash reports', 'Muting console error outputs', 'Disabling component mount features'], 'A'),
      { q: 'Describe how you optimize latency and minimize client-side database fetches in complex setups.', answer: '', type: 'practical' },
      { q: 'Write a short pseudocode demonstrating clean async state handling and cleanup hooks.', answer: '', type: 'practical' },
    ],
  });
}

export function simulateScope({ vagueness }) {
  const isBakery = vagueness.toLowerCase().includes('bakery');
  return delay({
    projectTitle: isBakery ? 'Bakery Digital E-Commerce Suite' : 'SaaS Workspace Launchpad',
    summary: `Turning the idea "${vagueness}" into a clear, buildable project brief with defined deliverables and milestones.`,
    deliverables: [
      'Responsive mobile-first layouts',
      'Brand color token configuration and style guide',
      'Milestone tracker and payments integration',
    ],
    suggestedTimeline: '3-4 weeks',
    budgetRange: { min: 800, max: 1800 },
    requiredSkills: isBakery ? ['React', 'UI/UX Design', 'SEO'] : ['React', 'TypeScript', 'Node.js'],
    milestones: [
      { name: 'Visual Figma layouts', duration: '1 week', description: 'Design UI mockup drafts.' },
      { name: 'Responsive React frontend', duration: '1 week', description: 'Build core grid tables & components.' },
      { name: 'API & release', duration: '1 week', description: 'Final testing and integration.' },
    ],
  });
}
