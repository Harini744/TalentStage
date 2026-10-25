import { useMemo, useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageContainer from '@/components/ui/PageContainer';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import AddPortfolioModal from '@/components/profile/AddPortfolioModal';
import PortfolioDetailModal from '@/components/profile/PortfolioDetailModal';

export default function PortfolioPage() {
  const { profile } = useAuth();
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState(null);

  // Newest first
  const items = useMemo(() => [...(profile.portfolio ?? [])].reverse(), [profile.portfolio]);

  return (
    <PageContainer width="2xl">
      <div className="flex justify-between items-center border-b border-line pb-3">
        <h3 className="text-lg font-serif font-semibold">My Portfolio Showcase</h3>
        <Button onClick={() => setAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={BookOpen} description="Your showcase is empty. Add a project to present your credentials." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="card card-hover overflow-hidden flex flex-col text-left"
            >
              <div className="h-32 w-full bg-gradient-to-br from-panel to-raised border-b border-line flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gold-500/40" />
              </div>
              <div className="p-4 flex-1 w-full">
                <span className="badge badge-gold">{item.category}</span>
                <h4 className="text-sm font-bold mt-2 truncate font-serif">{item.title}</h4>
                <p className="text-xs text-muted line-clamp-2 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
              <div className="px-4 pb-4 flex flex-wrap gap-1">
                {item.tools?.slice(0, 3).map((t) => <span key={t} className="chip !text-[9px] !px-2 !py-0.5">{t}</span>)}
              </div>
            </button>
          ))}
        </div>
      )}

      <AddPortfolioModal open={adding} onClose={() => setAdding(false)} />
      <PortfolioDetailModal item={selected} onClose={() => setSelected(null)} />
    </PageContainer>
  );
}
