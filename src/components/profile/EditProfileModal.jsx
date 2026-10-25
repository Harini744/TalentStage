import { useState } from 'react';
import { AVAILABILITY_OPTIONS, SKILLS_LIST } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Select, TextArea, TextInput } from '@/components/ui/Field';

function EditForm({ profile, onClose }) {
  const { updateProfile } = useAuth();
  const addToast = useToast();
  const [form, setForm] = useState({
    name: profile.name ?? '',
    specialty: profile.specialty ?? '',
    location: profile.location ?? '',
    bio: profile.bio ?? '',
    hourlyRate: profile.hourlyRate ?? 0,
    availability: profile.availability ?? 'available',
    skills: profile.skills ?? [],
  });
  const [customSkill, setCustomSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const toggleSkill = (skill) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));

  const addCustomSkill = () => {
    const skill = customSkill.trim();
    if (skill && !form.skills.includes(skill)) setForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setCustomSkill('');
  };

  const handleSave = async () => {
    if (!form.name.trim()) return addToast('Name is required.');
    setSaving(true);
    try {
      await updateProfile({
        ...form,
        name: form.name.trim(),
        specialty: form.specialty.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        hourlyRate: Number(form.hourlyRate) || 0,
      });
      addToast('Profile updated!');
      onClose();
    } catch (error) {
      console.error(error);
      addToast(`Failed to update profile: ${error.message}`);
      setSaving(false);
    }
  };

  const allSkills = [...new Set([...SKILLS_LIST, ...form.skills])];

  return (
    <div className="space-y-3">
      <TextInput label="Full Name" value={form.name} onChange={update('name')} />
      <TextInput label="Headline / Specialty" value={form.specialty} onChange={update('specialty')} placeholder="Full-Stack AI Engineer" />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="Location" value={form.location} onChange={update('location')} placeholder="City, Country" />
        <TextInput label="Hourly Rate ($)" type="number" min="0" value={form.hourlyRate} onChange={update('hourlyRate')} />
      </div>
      <Select label="Availability" options={AVAILABILITY_OPTIONS} value={form.availability} onChange={update('availability')} />
      <TextArea label="Professional Bio" rows={4} value={form.bio} onChange={update('bio')} />

      <div>
        <label className="field-label">Skills</label>
        <div className="flex flex-wrap gap-1.5">
          {allSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={cn('chip hover:border-gold-500/30', form.skills.includes(skill) && 'chip-active')}
            >
              {skill}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            className="input !py-1.5 text-xs"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
            placeholder="Add another skill..."
          />
          <Button variant="secondary" size="sm" onClick={addCustomSkill}>Add</Button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onClose} className="w-1/3">Cancel</Button>
        <Button loading={saving} onClick={handleSave} className="flex-1">Save Changes</Button>
      </div>
    </div>
  );
}

export default function EditProfileModal({ open, onClose }) {
  const { profile } = useAuth();
  return (
    <Modal open={open} onClose={onClose} title="Edit Profile" size="lg">
      {/* Mounted only while open, so the form always starts from the latest saved profile. */}
      <EditForm profile={profile} onClose={onClose} />
    </Modal>
  );
}
