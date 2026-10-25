import { useState } from 'react';
import { SKILLS_LIST } from '@/constants';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import { TextArea, TextInput } from '@/components/ui/Field';

export default function ProfileSetupStep({ onBack, onFinish, saving }) {
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState(50);
  const [skills, setSkills] = useState([]);

  const toggleSkill = (skill) =>
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Build Creative Profile</h3>
        <p className="text-sm text-muted">These details help AI smart matching calculations.</p>
      </div>

      <div className="space-y-4">
        <TextArea
          label="Brief Bio (Professional summary)"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Describe your credentials and specialization..."
        />
        <TextInput
          label="Desired Hourly Rate ($ USD)"
          type="number"
          min="0"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />

        <div>
          <label className="field-label">Claim Skills</label>
          <div className="flex flex-wrap gap-2 pt-1 max-h-28 overflow-y-auto pr-1">
            {SKILLS_LIST.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={cn('chip transition-all hover:border-gold-500/30', skills.includes(skill) && 'chip-active')}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="w-1/3">Back</Button>
        )}
        <Button
          loading={saving}
          onClick={() => onFinish({ bio: bio.trim(), hourlyRate: Number(rate) || 0, skills })}
          className="flex-1 !py-2.5"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
