import Modal from '@/components/ui/Modal';

const LINK_CLASS = 'flex-1 text-center py-2 text-xs font-semibold rounded transition-all';

export default function PortfolioDetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <Modal open onClose={onClose} title={item.title}>
      <p className="text-xs text-muted leading-relaxed">{item.desc}</p>

      {item.tools?.length > 0 && (
        <div>
          <span className="eyebrow">Tools</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {item.tools.map((t) => <span key={t} className="chip text-gold-500">{t}</span>)}
          </div>
        </div>
      )}

      {(item.github || item.live) && (
        <div className="flex gap-4 pt-4 border-t border-line">
          {item.github && (
            <a href={item.github} target="_blank" rel="noopener noreferrer" className={`${LINK_CLASS} bg-raised border border-line hover:border-gold-500 text-gold-500`}>
              GitHub Code
            </a>
          )}
          {item.live && (
            <a href={item.live} target="_blank" rel="noopener noreferrer" className={`${LINK_CLASS} bg-gold-500 text-black hover:scale-105`}>
              Live Preview
            </a>
          )}
        </div>
      )}
    </Modal>
  );
}
