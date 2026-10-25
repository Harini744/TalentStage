import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { requestWithdrawal } from '@/firebase/walletService';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/Field';

export default function WithdrawModal({ open, onClose, balance }) {
  const { user } = useAuth();
  const addToast = useToast();
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const value = Number(amount);
    if (!(value > 0)) return addToast('Enter a valid withdrawal amount.');
    if (value > balance) return addToast(`You can withdraw up to ${formatCurrency(balance)}.`);

    setSubmitting(true);
    try {
      await requestWithdrawal(user.uid, value);
      addToast('Withdrawal request recorded.');
      setAmount('');
      onClose();
    } catch (error) {
      console.error(error);
      addToast(`Withdrawal failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Withdraw Funds" size="sm">
      <p className="text-xs text-muted">
        Available balance: <span className="text-gold-500 font-mono">{formatCurrency(balance)}</span>. Payouts are simulated in this demo.
      </p>
      <TextInput
        label="Amount ($ USD)"
        type="number"
        min="1"
        max={balance}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="100"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button loading={submitting} onClick={handleSubmit}>Confirm Withdrawal</Button>
      </div>
    </Modal>
  );
}
