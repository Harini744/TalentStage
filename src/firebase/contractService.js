import {
  addDoc, arrayUnion, collection, doc, runTransaction, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS, SUBCOLLECTIONS } from './collections';
import { DELIVERABLE_STATUS, PLATFORM_FEE_RATE } from '@/constants';

const contractRef = (id) => doc(db, COLLECTIONS.CONTRACTS, id);

/** Freelancer updates a milestone's progress (not "Approved" — only the client can do that). */
export function updateDeliverableStatus(contractId, index, status) {
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(contractRef(contractId));
    const deliverables = [...snap.data().deliverables];
    if (deliverables[index].status === DELIVERABLE_STATUS.APPROVED) return;
    deliverables[index] = { ...deliverables[index], status };
    tx.update(contractRef(contractId), { deliverables });
  });
}

/**
 * Client approves a milestone: marks it approved, bumps the released counter and
 * records an income transaction for the freelancer. Runs in a Firestore
 * transaction so a double-click can never pay a milestone twice.
 */
export function approveMilestone(contractId, index) {
  return runTransaction(db, async (tx) => {
    const ref = contractRef(contractId);
    const snap = await tx.get(ref);
    const contract = snap.data();
    const deliverables = [...contract.deliverables];

    if (deliverables[index].status === DELIVERABLE_STATUS.APPROVED) return null;

    const gross = Math.round(contract.totalValue / deliverables.length);
    const commission = Math.round(gross * PLATFORM_FEE_RATE);
    const net = gross - commission;

    deliverables[index] = { ...deliverables[index], status: DELIVERABLE_STATUS.APPROVED };
    tx.update(ref, {
      deliverables,
      milestoneReleasedCount: (contract.milestoneReleasedCount || 0) + 1,
    });
    tx.set(doc(collection(db, COLLECTIONS.TRANSACTIONS)), {
      userId: contract.freelancerId,
      clientId: contract.clientId,
      contractId,
      project: contract.projectName,
      client: contract.clientName,
      category: contract.category || 'Other',
      type: 'Income',
      gross,
      commission,
      net,
      status: 'completed',
      createdAt: serverTimestamp(),
    });
    return net;
  });
}

export const addDeliveryLink = (contractId, link) =>
  updateDoc(contractRef(contractId), {
    deliveryLinks: arrayUnion({ id: crypto.randomUUID(), createdAt: Date.now(), ...link }),
  });

export const sendContractMessage = (contractId, sender, text) =>
  addDoc(collection(db, COLLECTIONS.CONTRACTS, contractId, SUBCOLLECTIONS.MESSAGES), {
    senderId: sender.uid,
    senderName: sender.name,
    text,
    createdAt: serverTimestamp(),
  });
