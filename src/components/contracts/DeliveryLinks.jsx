import { useState } from 'react';
import { ExternalLink, Link2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { addDeliveryLink } from '@/firebase/contractService';
import Button from '@/components/ui/Button';

/** Shared list of delivery links (Drive, GitHub, Figma…). Only the freelancer can add. */
export default function DeliveryLinks({ contract, canAdd }) {
  const { profile } = useAuth();
  const addToast = useToast();
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const links = contract.deliveryLinks ?? [];

  const handleAdd = async () => {
    if (!/^https?:\/\//i.test(url.trim())) return addToast('Enter a full link starting with http:// or https://');
    setSaving(true);
    try {
      await addDeliveryLink(contract.id, { label: label.trim() || url.trim(), url: url.trim(), by: profile.name });
      setLabel('');
      setUrl('');
    } catch (error) {
      console.error(error);
      addToast(`Couldn't add link: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-5">
      <span className="eyebrow">Delivery Links</span>

      {links.length === 0 ? (
        <p className="text-xs text-muted mt-2">No delivery links shared yet.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 text-[11px] bg-panel px-3 py-1.5 rounded border border-line font-mono text-gold-500 hover:border-gold-500/40"
              >
                <span className="truncate">{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      )}

      {canAdd && (
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <input className="input !py-1.5 text-xs sm:w-1/3" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional)" />
          <input className="input !py-1.5 text-xs" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/..." />
          <Button variant="secondary" size="sm" loading={saving} onClick={handleAdd}>
            <Link2 className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
