import { useState } from 'react';
import { Award, ExternalLink, Upload } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';

const METHODS = [
  { value: 'student', title: 'Student Verification', desc: 'Attach your student ID.', icon: Award },
  { value: 'linkedin', title: 'LinkedIn Profile URL', desc: 'Fast validation in under 2 mins.', icon: ExternalLink },
];

/**
 * Collects a verification request. It is stored on the profile as `pending` —
 * the gold "verified" badge is only granted by an admin (see firestore.rules).
 */
export default function VerifyIdentityStep({ onSubmit }) {
  const addToast = useToast();
  const [method, setMethod] = useState('student');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = () => {
    if (method === 'student' && !fileName) return addToast('Please attach your Student ID first.');
    if (method === 'linkedin' && !linkedinUrl.includes('linkedin.com')) {
      return addToast('Please enter a valid LinkedIn profile link.');
    }
    onSubmit({ method, linkedinUrl: method === 'linkedin' ? linkedinUrl : '', studentIdFile: method === 'student' ? fileName : '' });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Claim Your Trust Badge</h3>
        <p className="text-sm text-muted">Verified identity increases invite rates by 85%.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {METHODS.map(({ value, title, desc, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setMethod(value)}
            className={cn('p-4 border rounded-xl text-left bg-panel transition-all', method === value ? 'border-gold-500' : 'border-line')}
          >
            <Icon className="w-6 h-6 text-gold-500 mb-2" />
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-xs text-muted mt-1">{desc}</p>
          </button>
        ))}
      </div>

      {method === 'student' ? (
        <label className="block border-2 border-dashed border-line hover:border-gold-500/50 rounded-xl p-8 text-center bg-panel cursor-pointer transition-all">
          <Upload className="w-8 h-8 text-faint mx-auto mb-2" />
          <span className="text-sm text-muted">{fileName ? `Attached: ${fileName}` : 'Click to choose your student ID'}</span>
          <p className="text-[10px] text-faint mt-1">PNG, JPG or PDF</p>
          <input
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
        </label>
      ) : (
        <TextInput
          label="LinkedIn Profile Link"
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://linkedin.com/in/your-name"
        />
      )}

      <Button block onClick={handleSubmit} className="!py-2.5">Submit & Continue</Button>
    </div>
  );
}
