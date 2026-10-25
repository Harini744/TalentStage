/**
 * Public AI API used by pages. Each function uses the real Claude API when an
 * API key is provided, otherwise the local simulator.
 */
import { callClaudeJson } from './claudeClient';
import {
  simulateEvaluation, simulateMatch, simulatePortfolioReview, simulateScope, simulateSkillTest,
} from './simulator';

export function scopeProject({ description, apiKey }) {
  if (!apiKey) return simulateScope({ vagueness: description });
  return callClaudeJson({
    apiKey,
    system:
      'You are a project scoping expert. Convert vague client needs into JSON project briefs. Return ONLY valid JSON: { "projectTitle": "...", "summary": "...", "deliverables": ["..."], "suggestedTimeline": "...", "budgetRange": { "min": 500, "max": 1500 }, "requiredSkills": ["..."], "milestones": [] }',
    prompt: `Scoping need: ${description}`,
  });
}

export function matchFreelancers({ project, freelancers, apiKey }) {
  if (!apiKey) {
    return simulateMatch({ skills: project.skills, budget: project.budget, freelancers });
  }
  // Only send the fields the model needs (keeps tokens down and avoids sharing emails).
  const candidates = freelancers.map(({ id, name, specialty, skills, verifiedSkills, hourlyRate, rating }) => ({
    id, name, specialty, skills, verifiedSkills, hourlyRate, rating,
  }));
  return callClaudeJson({
    apiKey,
    system:
      'You are a freelancer matching engine. Rank the top 5 freelancers for a brief. Return ONLY JSON: { "matches": [ { "freelancerId": "...", "matchScore": 92, "reasoning": "..." } ] }',
    prompt: `Project: ${project.title}. Skills: ${project.skills.join(', ')}. Budget: ${project.budget}. Freelancers: ${JSON.stringify(candidates)}`,
  });
}

export function evaluateProposals({ project, proposals, apiKey }) {
  if (!apiKey) return simulateEvaluation({ proposals });
  const bids = proposals.map(({ id, freelancerName, bidAmount, timeline, cover }) => ({
    id, freelancerName, bidAmount, timeline, cover,
  }));
  return callClaudeJson({
    apiKey,
    system:
      'You are a proposal evaluator. Grade bids on Relevance (0-10), Clarity (0-10), Value (0-10). Return ONLY JSON: { "evaluations": [ { "proposalId": "...", "relevance": 8, "clarity": 9, "valueForMoney": 7, "totalScore": 24, "recommendation": "...", "shortlist": true } ] }',
    prompt: `Project: ${project.title}. Deliverables: ${project.deliverables.join(', ')}. Proposals: ${JSON.stringify(bids)}`,
  });
}

export function reviewPortfolio({ portfolio, apiKey }) {
  if (!apiKey) return simulatePortfolioReview({ portfolio });
  return callClaudeJson({
    apiKey,
    system:
      'You are an elite portfolio auditor. Return ONLY JSON: { "overallScore": 72, "strengths": ["..."], "improvements": [ { "area": "...", "issue": "...", "suggestion": "...", "priority": "high" } ], "missingElements": ["..."] }',
    prompt: `Audit this portfolio data: ${JSON.stringify(portfolio)}`,
  });
}

export function generateSkillTest({ skill, apiKey }) {
  if (!apiKey) return simulateSkillTest({ skill });
  return callClaudeJson({
    apiKey,
    system:
      'You are a skill assessment quiz generator. Generate a 10-question test: 8 MCQs (options listed in order A,B,C,D) and 2 practicals. Return ONLY valid JSON: { "questions": [ { "q": "...", "options": ["...","...","...","..."], "answer": "A", "type": "mcq" }, { "q": "...", "type": "practical" } ] }',
    prompt: `Generate assessment for ${skill}`,
  });
}
