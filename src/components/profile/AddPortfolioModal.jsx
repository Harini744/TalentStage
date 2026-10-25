import { useState } from 'react';
import { PROJECT_CATEGORIES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { addPortfolioItem } from '@/firebase/userService';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Select, TextArea, TextInput } from '@/components/ui/Field';

const EMPTY = { title: '', category: PROJECT_CATEGORIES[0].value, tools: '', desc: '', github: '', live: '' };

export default function AddPortfolioModal({ open, onClose }) {
  const { user } = useAuth();
  const addToast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.desc.trim()) return addToast('Title and description are required.');
    setSaving(true);
    try {
      await addPortfolioItem(user.uid, {
        title: form.title.trim(),
        category: form.category,
        desc: form.desc.trim(),
        tools: form.tools.split(',').map((t) => t.trim()).filter(Boolean),
        github: form.github.trim(),
        live: form.live.trim(),
      });
      addToast(`"${form.title}" added to your gallery!`);
      setForm(EMPTY);
      onClose();
    } catch (error) {
      console.error(error);
      addToast(`Failed to add portfolio item: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Portfolio Project">
      <div className="space-y-3">
        <TextInput label="Project Title" value={form.title} onChange={update('title')} placeholder="Glassmorphism Prompt Editor" />
        <Select label="Category" options={PROJECT_CATEGORIES} value={form.category} onChange={update('category')} />
        <TextInput label="Tools Used (comma separated)" value={form.tools} onChange={update('tools')} placeholder="React, Next.js, CSS" />
        <TextArea label="Project Description" rows={4} value={form.desc} onChange={update('desc')} placeholder="Describe the problem, outcomes, and challenges resolved..." />
        <div className="grid grid-cols-2 gap-2">
          <TextInput label="GitHub URL" type="url" value={form.github} onChange={update('github')} placeholder="https://github.com/..." />
          <TextInput label="Live URL" type="url" value={form.live} onChange={update('live')} placeholder="https://..." />
        </div>
      </div>
      <Button block loading={saving} onClick={handleSave}>Save Project Showcase</Button>
    </Modal>
  );
}
