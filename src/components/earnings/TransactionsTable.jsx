import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function TransactionsTable({ transactions }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-line bg-panel">
        <h4 className="text-sm font-serif font-bold text-gold-500">Vault Transaction Log</h4>
      </div>

      {transactions.length === 0 ? (
        <p className="p-8 text-center text-xs text-muted">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-panel text-faint font-mono border-b border-line uppercase text-[10px]">
                <th className="p-4">Date</th>
                <th className="p-4">Project</th>
                <th className="p-4">Client</th>
                <th className="p-4">Gross</th>
                <th className="p-4">Platform Fee</th>
                <th className="p-4 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-line/50 hover:bg-raised/10">
                  <td className="p-4 font-mono text-faint whitespace-nowrap">{formatDate(t.createdAt)}</td>
                  <td className="p-4 font-semibold">{t.project}</td>
                  <td className="p-4 text-muted">{t.client}</td>
                  <td className="p-4 font-mono">{formatCurrency(t.gross)}</td>
                  <td className="p-4 font-mono text-faint">{formatCurrency(t.commission)}</td>
                  <td className={cn('p-4 font-mono text-right font-bold', t.net > 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {formatCurrency(t.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
