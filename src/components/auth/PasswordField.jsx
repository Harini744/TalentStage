import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Field } from '@/components/ui/Field';

export default function PasswordField({ label = 'Password', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label}>
      <div className="relative">
        <input type={visible ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-3 text-faint hover:text-muted"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </Field>
  );
}
