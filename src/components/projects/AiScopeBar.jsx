import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAiSettings } from '@/context/AiSettingsContext';
import { useToast } from '@/context/ToastContext';
import { scopeProject } from '@/services/ai';
import Button from '@/components/ui/Button';

/** "Describe it vaguely, Claude writes the brief" helper shown above the wizard. */
export default function AiScopeBar({ onScoped }) {
  const { apiKey } = useAiSettings();
  const addToast = useToast();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return addToast('Type a basic project idea first.');
    setLoading(true);
    addToast('Claude is drafting your deliverables list...');
    try {
      onScoped(await scopeProject({ description: input.trim(), apiKey }));
      addToast('AI scoping applied — review your brief below.');
    } catch (error) {
      console.error(error);
      addToast(`Scoping error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-gold-500/20 p-5 flex flex-col md:flex-row items-center gap-4 justify-between">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
          <Sparkles className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold font-serif">Struggling to write deliverables?</h4>
          <p className="text-xs text-muted">Describe your bakery, app, or blog and Claude will auto-scope the brief.</p>
        </div>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="e.g. website for organic bakery"
          className="input !py-1.5 text-xs md:w-56"
        />
        <Button loading={loading} onClick={run} className="shrink-0">AI Scope Assist</Button>
      </div>
    </div>
  );
}
