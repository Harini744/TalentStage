import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Read-only list of skill chips; verified skills get a gold check. */
export default function SkillTags({ skills = [], verified = [], className }) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {skills.map((skill) => {
        const isVerified = verified.includes(skill);
        return (
          <span key={skill} className={cn('chip', isVerified && 'bg-gold-500/10 text-gold-500 border-gold-500/30 font-semibold')}>
            {skill}
            {isVerified && <Check className="w-3.5 h-3.5" />}
          </span>
        );
      })}
    </div>
  );
}
