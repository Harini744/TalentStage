import { addDoc, collection, doc, increment, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS, SUBCOLLECTIONS } from './collections';
import { PROJECT_STATUS, PROPOSAL_STATUS, DELIVERABLE_STATUS } from '@/constants';

export function createProject(uid, profile, data) {
  return addDoc(collection(db, COLLECTIONS.PROJECTS), {
    ...data,
    clientId: uid,
    client: { name: profile.name, avatar: profile.avatar || '' },
    status: PROJECT_STATUS.OPEN,
    proposalsCount: 0,
    createdAt: serverTimestamp(),
  });
}

/** Creates the proposal and bumps the project's proposal counter atomically. */
export function submitProposal(uid, profile, project, { bidAmount, timeline, cover }) {
  const batch = writeBatch(db);
  const proposalRef = doc(collection(db, COLLECTIONS.PROPOSALS));

  batch.set(proposalRef, {
    projectId: project.id,
    projectTitle: project.title,
    clientId: project.clientId,
    freelancerId: uid,
    freelancerName: profile.name,
    freelancerAvatar: profile.avatar || '',
    bidAmount,
    timeline,
    cover,
    status: PROPOSAL_STATUS.PENDING,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db, COLLECTIONS.PROJECTS, project.id), { proposalsCount: increment(1) });

  return batch.commit();
}

/**
 * Hire a freelancer: creates the contract (+ opening chat message), marks the
 * proposal as hired and closes the project to new bids — all in one batch.
 */
export function hireFreelancer({ clientId, clientName, project, proposal }) {
  const batch = writeBatch(db);
  const contractRef = doc(collection(db, COLLECTIONS.CONTRACTS));
  const messageRef = doc(collection(contractRef, SUBCOLLECTIONS.MESSAGES));

  const deliverables = (project.deliverables?.length ? project.deliverables : ['Final delivery']).map((name) => ({
    name,
    status: DELIVERABLE_STATUS.NOT_STARTED,
  }));

  batch.set(contractRef, {
    projectId: project.id,
    projectName: project.title,
    category: project.category,
    clientId,
    clientName,
    freelancerId: proposal.freelancerId,
    freelancerName: proposal.freelancerName,
    participants: [clientId, proposal.freelancerId],
    totalValue: proposal.bidAmount,
    deliverables,
    deliveryLinks: [],
    milestoneReleasedCount: 0,
    createdAt: serverTimestamp(),
  });
  batch.set(messageRef, {
    senderId: 'system',
    senderName: 'System',
    text: `Contract established with ${proposal.freelancerName} for $${proposal.bidAmount}. Milestone funds are held in escrow.`,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db, COLLECTIONS.PROPOSALS, proposal.id), { status: PROPOSAL_STATUS.HIRED });
  batch.update(doc(db, COLLECTIONS.PROJECTS, project.id), { status: PROJECT_STATUS.IN_PROGRESS });

  return batch.commit().then(() => contractRef.id);
}
