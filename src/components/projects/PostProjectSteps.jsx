import { useState } from 'react';
import { X } from 'lucide-react';
import { EXPERIENCE_LEVELS, PROJECT_CATEGORIES } from '@/constants';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';
import { Field, Select, TextArea, TextInput } from '@/components/ui/Field';

const stepClass = 'space-y-4 animate-slide-up';

export function BasicsStep({ fields, onChange }) {
  return (
    <div className={stepClass}>
      <TextInput
        label="Project Working Title"
        value={fields.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="React E-Commerce Payment Gateway Integration"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={PROJECT_CATEGORIES} value={fields.category} onChange={(e) => onChange({ category: e.target.value })} />
        <Field label="Contract Type">
          <div className="flex gap-2">
            {[['fixed', 'Fixed Price'], ['hourly', 'Hourly Rate']].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ type: value })}
                className={cn(
                  'flex-1 py-2.5 text-xs font-semibold rounded-lg border transition-all',
                  fields.type === value ? 'bg-gold-500 text-black border-gold-500' : 'bg-panel text-muted border-line'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

/** Small "type + Add" list editor used for both skills and deliverables. */
function TagAdder({ label, placeholder, items, onAdd, onRemove, asList = false }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (value && !items.includes(value)) onAdd(value);
    setDraft('');
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex gap-2">
        <input
          className="input !py-1.5 text-xs"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
        />
        <Button variant="secondary" size="sm" onClick={add}>Add</Button>
      </div>

      {asList ? (
        <ul className="mt-2 space-y-1">
          {items.map((item) => (
            <li key={item} className="flex items-center justify-between text-xs bg-panel border border-line px-3 py-1.5 rounded">
              <span className="truncate">{item}</span>
              <button type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item}`} className="text-red-400 hover:text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((item) => (
            <button key={item} type="button" onClick={() => onRemove(item)} title="Click to remove" className="chip text-gold-500 hover:border-red-400/50">
              {item}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DetailsStep({ fields, onChange }) {
  return (
    <div className={stepClass}>
      <TextArea
        label="Detailed Description"
        rows={6}
        value={fields.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Explain what problem is being solved, expected deliverables, and design parameters."
      />
      <TagAdder
        label="Required Skills"
        placeholder="Framer, Python..."
        items={fields.skills}
        onAdd={(s) => onChange({ skills: [...fields.skills, s] })}
        onRemove={(s) => onChange({ skills: fields.skills.filter((x) => x !== s) })}
      />
      <TagAdder
        label="Deliverables Checklist (each becomes an escrow milestone)"
        placeholder="Milestone 1: Prototype screens delivery..."
        items={fields.deliverables}
        onAdd={(d) => onChange({ deliverables: [...fields.deliverables, d] })}
        onRemove={(d) => onChange({ deliverables: fields.deliverables.filter((x) => x !== d) })}
        asList
      />
    </div>
  );
}

export function BudgetStep({ fields, onChange }) {
  return (
    <div className={cn(stepClass, 'space-y-5')}>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Min Budget ($ USD)" type="number" min="0" value={fields.minBudget} onChange={(e) => onChange({ minBudget: e.target.value })} />
        <TextInput label="Max Budget ($ USD)" type="number" min="0" value={fields.maxBudget} onChange={(e) => onChange({ maxBudget: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Target Deadline" type="date" value={fields.deadline} onChange={(e) => onChange({ deadline: e.target.value })} />
        <Select label="Required Talent Level" options={EXPERIENCE_LEVELS} value={fields.experience} onChange={(e) => onChange({ experience: e.target.value })} />
      </div>
    </div>
  );
}

export function ReviewStep({ fields }) {
  return (
    <div className={stepClass}>
      <div className="bg-panel border border-line p-5 rounded-xl">
        <span className="text-[10px] font-mono text-gold-500 uppercase">Brief Preview</span>
        <h3 className="text-xl font-serif font-bold mt-1">{fields.title || 'Untitled Project'}</h3>
        <div className="flex gap-2 flex-wrap text-[10px] font-mono text-muted mt-2 border-b border-line pb-3">
          <span>Category: {fields.category}</span>
          <span>•</span>
          <span>Budget: {formatCurrency(fields.minBudget)} – {formatCurrency(fields.maxBudget)}</span>
          <span>•</span>
          <span>Deadline: {fields.deadline}</span>
        </div>

        <p className="text-xs text-muted mt-3 leading-relaxed">{fields.description || 'No description provided.'}</p>

        <div className="mt-4">
          <span className="eyebrow">Skills Required</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {fields.skills.length ? fields.skills.map((s) => <span key={s} className="chip text-gold-500">{s}</span>) : <span className="text-xs text-faint">None listed</span>}
          </div>
        </div>

        <div className="mt-4">
          <span className="eyebrow">Deliverables ({fields.deliverables.length})</span>
          <ul className="list-disc pl-4 text-xs text-muted mt-1 space-y-1">
            {fields.deliverables.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
