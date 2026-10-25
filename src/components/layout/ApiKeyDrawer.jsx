import { useState } from 'react';
import { X } from 'lucide-react';
import { useAiSettings } from '@/context/AiSettingsContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';

function DrawerBody({ initialKey, onSave, onClose }) {
  const [draft, setDraft] = useState(initialKey);

  return (
    <div className="bg-panel border-l border-line w-80 p-6 flex flex-col justify-between h-full animate-slide-left">
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-line pb-2">
          <h3 className="text-base font-serif font-bold">AI Orchestration Setup</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-fg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-muted leading-normal">
          Add your own Anthropic API key to run the AI features (scoping, matching, proposal evaluation,
          portfolio audit, skill tests) with real Claude responses.
        </p>

        <div className="card border-gold-500/20 p-3 text-[10px] text-gold-500 font-mono leading-normal">
          No key? Everything still works — the app falls back to local sandbox simulations. Your key is kept
          only for this browser tab and is never saved to your account.
        </div>

        <TextInput
          label="Anthropic API Key"
          type="password"
          autoComplete="off"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="sk-ant-..."
          className="font-mono text-xs"
        />
      </div>

      <Button block onClick={() => onSave(draft.trim())}>
        Confirm Credentials
      </Button>
    </div>
  );
}

export default function ApiKeyDrawer() {
  const { apiKey, setApiKey, drawerOpen, closeDrawer } = useAiSettings();
  const addToast = useToast();

  if (!drawerOpen) return null;

  const handleSave = (key) => {
    setApiKey(key);
    addToast(key ? 'API key saved for this session.' : 'API key cleared — using sandbox simulations.');
    closeDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/80 glass" onMouseDown={(e) => e.target === e.currentTarget && closeDrawer()}>
      <DrawerBody initialKey={apiKey} onSave={handleSave} onClose={closeDrawer} />
    </div>
  );
}
