import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createProject } from '@/firebase/projectService';
import { ROUTES } from '@/config/navigation';
import { dateInputValue } from '@/utils/format';
import { cn } from '@/utils/cn';
import PageContainer from '@/components/ui/PageContainer';
import Button from '@/components/ui/Button';
import AiScopeBar from '@/components/projects/AiScopeBar';
import { BasicsStep, BudgetStep, DetailsStep, ReviewStep } from '@/components/projects/PostProjectSteps';

const STEPS = [
  { label: 'Basics', Component: BasicsStep },
  { label: 'Details', Component: DetailsStep },
  { label: 'Budget', Component: BudgetStep },
  { label: 'Review', Component: ReviewStep },
];

const createInitialFields = () => ({
  title: '',
  type: 'fixed',
  category: 'Web Dev',
  description: '',
  skills: [],
  deliverables: [],
  minBudget: 500,
  maxBudget: 1500,
  deadline: dateInputValue(30),
  experience: 'Expert',
});

export default function PostProjectPage() {
  const { user, profile } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [fields, setFields] = useState(createInitialFields);
  const [posting, setPosting] = useState(false);

  const patchFields = (patch) => setFields((prev) => ({ ...prev, ...patch }));
  const isLastStep = stepIndex === STEPS.length - 1;
  const { Component: StepComponent } = STEPS[stepIndex];

  const applyAiScope = (result) => {
    patchFields({
      title: result.projectTitle || fields.title,
      description: result.summary || fields.description,
      skills: result.requiredSkills || fields.skills,
      deliverables: result.deliverables || fields.deliverables,
      minBudget: result.budgetRange?.min ?? fields.minBudget,
      maxBudget: result.budgetRange?.max ?? fields.maxBudget,
    });
    setStepIndex(STEPS.length - 1);
  };

  const handlePost = async () => {
    if (!fields.title.trim() || !fields.description.trim()) return addToast('Please fill in a title and description.');
    const min = Number(fields.minBudget);
    const max = Number(fields.maxBudget);
    if (!(max > 0) || min > max) return addToast('Budget must be positive, with min no higher than max.');

    setPosting(true);
    try {
      await createProject(user.uid, profile, {
        title: fields.title.trim(),
        description: fields.description.trim(),
        category: fields.category,
        type: fields.type,
        budgetMin: min,
        budget: max,
        deadline: fields.deadline,
        skills: fields.skills,
        experienceLevel: fields.experience,
        deliverables: fields.deliverables.length ? fields.deliverables : ['Final delivery'],
      });
      addToast(`"${fields.title}" posted to the marketplace!`);
      navigate(ROUTES.MY_PROJECTS);
    } catch (error) {
      console.error(error);
      addToast(`Failed to post project: ${error.message}`);
      setPosting(false);
    }
  };

  return (
    <PageContainer width="lg">
      <AiScopeBar onScoped={applyAiScope} />

      <div className="card overflow-hidden shadow-xl">
        <div className="flex border-b border-line text-xs font-mono">
          {STEPS.map(({ label }, i) => (
            <div
              key={label}
              className={cn(
                'flex-1 py-3 text-center transition-all',
                i === stepIndex ? 'bg-raised border-b-2 border-gold-500 text-gold-500' : 'text-faint'
              )}
            >
              <span className="hidden sm:inline">Step {i + 1}: </span>{label}
            </div>
          ))}
        </div>

        <div className="p-6 min-h-80">
          <StepComponent key={stepIndex} fields={fields} onChange={patchFields} />
        </div>

        <div className="bg-panel border-t border-line px-6 py-4 flex justify-between">
          <Button variant="ghost" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => i - 1)}>Previous</Button>
          {isLastStep ? (
            <Button loading={posting} onClick={handlePost}>Post Project to Marketplace</Button>
          ) : (
            <Button variant="secondary" onClick={() => setStepIndex((i) => i + 1)}>Continue</Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
