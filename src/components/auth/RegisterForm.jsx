import { useState } from 'react';
import { Briefcase, Sparkles, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getAuthErrorMessage } from '@/firebase/authService';
import { ROLES } from '@/constants';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';
import PasswordField from './PasswordField';

const ROLE_OPTIONS = [
  { value: ROLES.FREELANCER, title: 'Freelancer', desc: 'Monetize elite skills', icon: Briefcase },
  { value: ROLES.CLIENT, title: 'Client', desc: 'Scope & hire creators', icon: Users },
  { value: ROLES.BOTH, title: 'Hybrid Mode', desc: 'Collaborate freely', icon: Sparkles },
];

export default function RegisterForm({ onSwitchToLogin }) {
  const { signUp } = useAuth();
  const addToast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: ROLES.BOTH });
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signUp({ ...form, name: form.name.trim(), email: form.email.trim() });
      addToast("Account created! Let's verify your identity.");
      // PublicOnly guard sends the new user on to /onboarding.
    } catch (error) {
      addToast(getAuthErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
      <div>
        <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Build Your Identity</h3>
        <p className="text-sm text-muted">Join the market as freelancer, client or manage both.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ROLE_OPTIONS.map(({ value, title, desc, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, role: value }))}
            className={cn(
              'p-3 text-left border rounded-xl transition-all',
              form.role === value ? 'border-gold-500 bg-card card-glow' : 'border-line bg-panel hover:border-gold-500/30'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-raised flex items-center justify-center mb-2">
              <Icon className="w-4 h-4 text-gold-500" />
            </div>
            <h4 className="text-xs font-semibold">{title}</h4>
            <p className="text-[10px] text-muted leading-tight mt-1">{desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <TextInput label="Full Name" required autoComplete="name" value={form.name} onChange={update('name')} placeholder="Your full name" />
        <TextInput label="Email Address" type="email" required autoComplete="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
        <PasswordField required minLength={6} autoComplete="new-password" value={form.password} onChange={update('password')} />
      </div>

      <Button type="submit" block loading={submitting} className="!py-3 !text-sm">Create Account</Button>

      <div className="text-center">
        <button type="button" onClick={onSwitchToLogin} className="text-xs text-gold-500 hover:underline">
          Already have an account? Log In
        </button>
      </div>
    </form>
  );
}
