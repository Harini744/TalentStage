import { useToast } from '@/context/ToastContext';
import { MENTORS } from '@/constants/fallbackData';
import PageContainer from '@/components/ui/PageContainer';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

export default function MentorshipPage() {
  const addToast = useToast();

  return (
    <PageContainer>
      <h3 className="section-title">Elite Product & Tech Coaches</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MENTORS.map((m) => (
          <div key={m.id} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={m.name} />
              <div>
                <h4 className="text-xs font-bold font-serif">{m.name}</h4>
                <p className="text-[11px] text-muted leading-tight mt-0.5">{m.specialty}</p>
                <span className="text-[10px] text-gold-500 font-mono mt-1 block">Session cost: {m.rate}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="text-gold-500" onClick={() => addToast(`Session request sent to ${m.name}!`)}>
              Book Session
            </Button>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
