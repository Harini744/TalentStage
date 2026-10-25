import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Award, Sparkles } from 'lucide-react';
import { QUIZ_DURATION_SECONDS, QUIZ_PASS_PERCENT } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useAiSettings } from '@/context/AiSettingsContext';
import { useToast } from '@/context/ToastContext';
import { addVerifiedSkill } from '@/firebase/userService';
import { generateSkillTest } from '@/services/ai';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Select } from '@/components/ui/Field';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function QuizTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  const expireRef = useRef(onExpire);

  useEffect(() => {
    expireRef.current = onExpire;
  });

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining === 0) expireRef.current();
  }, [remaining]);

  const m = Math.floor(Math.max(remaining, 0) / 60);
  const s = String(Math.max(remaining, 0) % 60).padStart(2, '0');
  return <span className={cn('font-bold', remaining < 60 ? 'text-red-400' : 'text-gold-500')}>{m}m {s}s remaining</span>;
}

function QuizBody({ onClose, onPassed }) {
  const { user, profile } = useAuth();
  const { apiKey } = useAiSettings();
  const addToast = useToast();

  const skills = profile.skills ?? [];
  const [skill, setSkill] = useState(skills[0] ?? '');
  const [phase, setPhase] = useState('select'); // select | loading | quiz | result
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [passed, setPassed] = useState(false);

  const start = async () => {
    setPhase('loading');
    setIndex(0);
    setAnswers({});
    addToast(`Generating a 10-question check for ${skill}...`);
    try {
      const result = await generateSkillTest({ skill, apiKey });
      setQuestions(result.questions);
      setPhase('quiz');
    } catch (error) {
      console.error(error);
      addToast(`Quiz creation failed: ${error.message}`);
      setPhase('select');
    }
  };

  const submit = async () => {
    const mcqs = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.type === 'mcq');
    const correct = mcqs.filter(({ q, i }) => answers[i] === q.answer).length;
    const didPass = mcqs.length > 0 && (correct / mcqs.length) * 100 >= QUIZ_PASS_PERCENT;

    setPassed(didPass);
    setPhase('result');

    if (!didPass) return addToast(`Score below ${QUIZ_PASS_PERCENT}%. Review the topic and try again.`);
    try {
      await addVerifiedSkill(user.uid, skill);
      onPassed(skill);
    } catch (error) {
      console.error(error);
      addToast(`Passed, but saving your badge failed: ${error.message}`);
    }
  };

  if (phase === 'select') {
    return skills.length === 0 ? (
      <p className="text-xs text-muted">Add some skills to your profile first (Edit Profile), then come back to verify them.</p>
    ) : (
      <div className="space-y-4">
        <p className="text-xs text-muted leading-normal">
          Verified skills carry more weight in AI matching. Pick one of your claimed skills to start a 10-question test.
        </p>
        <Select label="Select skill" options={skills} value={skill} onChange={(e) => setSkill(e.target.value)} />
        <Button block onClick={start}>Generate Test</Button>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-center space-y-3">
        <Sparkles className="w-8 h-8 text-gold-500 animate-bounce" />
        <span className="text-xs text-muted">Preparing your questions...</span>
      </div>
    );
  }

  if (phase === 'result') {
    const Icon = passed ? Award : AlertCircle;
    return (
      <div className="text-center space-y-4 py-6">
        <Icon className={cn('w-12 h-12 mx-auto', passed ? 'text-gold-500 animate-bounce' : 'text-red-400')} />
        <h4 className={cn('text-lg font-serif font-bold', passed ? 'text-gold-500' : 'text-red-400')}>
          {passed ? `Exam Passed! (${QUIZ_PASS_PERCENT}%+)` : 'Score Below Threshold'}
        </h4>
        <p className="text-xs text-muted max-w-sm mx-auto leading-normal">
          {passed
            ? `A verified badge for ${skill} has been added to your profile.`
            : `Multiple-choice answers scored below ${QUIZ_PASS_PERCENT}%. Review the material and retake the test.`}
        </p>
        <Button variant="secondary" onClick={onClose}>Return to Profile</Button>
      </div>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  return (
    <div className="space-y-4">
      <div className="w-full bg-panel h-1.5 rounded-full overflow-hidden">
        <div className="bg-gold-500 h-full transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="text-xs font-mono text-faint flex justify-between">
        <span>Question {index + 1} of {questions.length}</span>
        <QuizTimer seconds={QUIZ_DURATION_SECONDS} onExpire={submit} />
      </div>

      <div className="bg-panel border border-line p-4 rounded-lg">
        <h4 className="text-sm font-semibold leading-relaxed">{question.q}</h4>
      </div>

      {question.type === 'mcq' ? (
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <button
              key={option}
              type="button"
              onClick={() => setAnswers((prev) => ({ ...prev, [index]: OPTION_LABELS[i] }))}
              className={cn(
                'w-full p-3 text-left rounded-lg text-xs border transition-all',
                answers[index] === OPTION_LABELS[i] ? 'border-gold-500 bg-raised' : 'border-line bg-panel hover:border-gold-500/20'
              )}
            >
              <span className="font-mono text-gold-500 font-bold mr-2">{OPTION_LABELS[i]}.</span>
              {option}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={answers[index] ?? ''}
          onChange={(e) => setAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
          rows={4}
          className="input text-xs"
          placeholder="Write your explanation here (practical answers aren't auto-graded)..."
        />
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>Back</Button>
        {isLast ? (
          <Button onClick={submit}>Submit Exam Paper</Button>
        ) : (
          <Button variant="secondary" onClick={() => setIndex((i) => i + 1)}>Next Question</Button>
        )}
      </div>
    </div>
  );
}

export default function SkillQuizModal({ open, onClose, onPassed }) {
  return (
    <Modal open={open} onClose={onClose} title="Skill Credential Quiz" size="lg">
      <QuizBody onClose={onClose} onPassed={onPassed} />
    </Modal>
  );
}
