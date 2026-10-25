import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { formatCurrency } from '@/utils/format';

const TOOLTIP_STYLE = { backgroundColor: '#1A1A28', borderColor: '#2A2A42', borderRadius: 8 };

export default function EarningsCharts({ monthly, categoryShare }) {
  const hasIncome = monthly.some((m) => m.amount > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card p-5">
        <span className="eyebrow mb-4 block">Earnings Progression (net)</span>
        <div className="h-64">
          {hasIncome ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5C842" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F5C842" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E30" />
                <XAxis dataKey="name" stroke="#9B97B2" fontSize={11} />
                <YAxis stroke="#9B97B2" fontSize={11} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => formatCurrency(v)} />
                <Area type="monotone" dataKey="amount" stroke="#F5C842" strokeWidth={2} fill="url(#earningsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="h-full flex items-center justify-center text-xs text-muted">
              Earnings will chart here once a milestone is approved.
            </p>
          )}
        </div>
      </div>

      <div className="card p-5 flex flex-col">
        <span className="eyebrow mb-2 block">Specialization Share</span>
        {categoryShare.length === 0 ? (
          <p className="flex-1 flex items-center justify-center text-xs text-muted text-center py-10">No income yet.</p>
        ) : (
          <>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryShare} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                    {categoryShare.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-4 border-t border-line pt-3">
              {categoryShare.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="truncate text-muted">{c.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
