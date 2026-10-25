import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getAuthErrorMessage } from '@/firebase/authService';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';
import PasswordField from './PasswordField';

export default function LoginForm({ onSwitchToRegister }) {
  const { signIn } = useAuth();
  const addToast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(form.email.trim(), form.password);
      // PublicOnly guard redirects once the profile loads.
    } catch (error) {
      addToast(getAuthErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
      <div>
        <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Welcome Back</h3>
        <p className="text-sm text-muted">Sign in to access your dashboard and active contracts.</p>
      </div>

      <div className="space-y-4">
        <TextInput label="Email Address" type="email" required autoComplete="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
        <PasswordField required autoComplete="current-password" value={form.password} onChange={update('password')} />
      </div>

      <Button type="submit" block loading={submitting} className="!py-3 !text-sm">Log In</Button>

      <div className="text-center">
        <button type="button" onClick={onSwitchToRegister} className="text-xs text-gold-500 hover:underline">
          Don&apos;t have an account? Sign Up
        </button>
      </div>
    </form>
  );
}
