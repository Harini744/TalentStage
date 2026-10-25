import { cn } from '@/utils/cn';

const STEPS = ['01. ACCOUNT', '02. IDENTITY', '03. PORTFOLIO'];

/** Split-screen layout shared by sign-in and onboarding: brand panel on the left, form on the right. */
export default function AuthShell({ step = 1, children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-gradient-to-br from-panel to-card border-r border-line p-10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-2 relative">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center font-serif text-black font-bold">T</div>
          <span className="text-xl font-serif font-semibold tracking-wider text-gold-500">TalentStage</span>
        </div>

        <div className="my-auto relative max-w-md py-10">
          <span className="text-xs font-mono uppercase tracking-widest text-faint border border-line px-2 py-1 rounded-full">
            DevFusion Hackathon 2.0
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mt-4 leading-tight">
            Where premium editorial layout meets <span className="text-gold-500">AI intelligence</span>.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            A production-grade network for elite developers and product coaches. Instantly test skills, scope
            deliverables via LLM API, and release escrow milestone payouts.
          </p>
        </div>

        <div className="text-xs font-mono text-faint relative">&copy; 2026 TalentStage.</div>
      </div>

      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center justify-between mb-8 text-xs font-mono">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={cn('pb-2 border-b-2 w-1/3', step >= i + 1 ? 'border-gold-500 text-gold-500' : 'border-line text-faint')}
              >
                {label}
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
