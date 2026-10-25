import { Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function AuditReport({ audit }) {
  return (
    <div className="card border-gold-500/20 p-6 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          <h3 className="text-base font-serif font-bold">Claude Portfolio Audit Report</h3>
        </div>
        <Badge tone="gold" className="!text-xs !px-3 font-bold">Score: {audit.overallScore}%</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <span className="eyebrow block">Areas for Action ({audit.improvements?.length ?? 0})</span>
          {audit.improvements?.map((item, i) => (
            <div key={i} className="p-3 bg-panel border border-line rounded-lg text-xs">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-gold-500">{item.area}</span>
                <Badge tone={item.priority === 'high' ? 'danger' : 'gold'}>{item.priority}</Badge>
              </div>
              <p className="text-muted leading-normal">{item.suggestion}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <span className="eyebrow block">Key Strengths</span>
            <ul className="list-disc pl-4 text-xs text-emerald-400 mt-2 space-y-1">
              {audit.strengths?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <span className="eyebrow block">Missing Elements</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {audit.missingElements?.map((m) => (
                <span key={m} className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 rounded-full">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
