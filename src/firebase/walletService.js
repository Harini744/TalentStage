import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

/** Records a (simulated) payout request as a negative transaction. */
export const requestWithdrawal = (uid, amount) =>
  addDoc(collection(db, COLLECTIONS.TRANSACTIONS), {
    userId: uid,
    project: 'Withdrawal to bank account',
    client: 'Personal Wallet',
    category: 'Withdrawal',
    type: 'Withdrawal',
    gross: -amount,
    commission: 0,
    net: -amount,
    status: 'completed',
    createdAt: serverTimestamp(),
  });
