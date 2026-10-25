import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DASHBOARD_ITEM, NAV_SECTIONS, ROUTES } from '@/config/navigation';
import { getProfileCompleteness } from '@/utils/profile';
import { cn } from '@/utils/cn';

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all',
          isActive
            ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 font-medium'
            : 'text-muted hover:text-fg hover:bg-card/50'
        )
      }
    >
      <item.icon className="w-4 h-4 shrink-0" />
      <span>{item.label}</span>
    </NavLink>
  );
}

function CompletenessGauge({ score }) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90">
        <circle cx="24" cy="24" r={RADIUS} fill="transparent" stroke="var(--color-line)" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={RADIUS} fill="transparent" stroke="var(--color-gold-500)" strokeWidth="3"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-[10px] font-mono font-bold">{score}%</span>
    </div>
  );
}

/** Sidebar body, shared by the desktop rail and the mobile drawer. */
export default function Sidebar({ onNavigate }) {
  const { profile, signOut } = useAuth();
  const score = getProfileCompleteness(profile);
  const roleLabel = profile.role === 'both' ? 'Hybrid Platform' : `${profile.role} Mode`;

  return (
    <div className="h-full flex flex-col justify-between bg-panel">
      <div className="flex flex-col gap-6 p-6 overflow-y-auto">
        <NavLink to={ROUTES.DASHBOARD} onClick={onNavigate} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center font-serif text-black font-extrabold text-sm">T</div>
          <span className="text-lg font-serif font-semibold tracking-wider text-gold-500">TalentStage</span>
          {profile.proMember && <span className="badge badge-gold !text-[9px]">Pro</span>}
        </NavLink>

        <div className="card p-3">
          <span className="eyebrow block mb-1">Your Context</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase">{roleLabel}</span>
            <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <NavItem item={DASHBOARD_ITEM} onNavigate={onNavigate} />
          </div>
          {NAV_SECTIONS.filter((s) => !s.roles || s.roles.includes(profile.role)).map((section) => (
            <div key={section.title} className="flex flex-col gap-1.5">
              <span className="eyebrow tracking-wider mb-1">{section.title}</span>
              {section.items.map((item) => (
                <NavItem key={item.path} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-line bg-ink/60">
        <div className="flex items-center gap-3">
          <CompletenessGauge score={score} />
          <div className="min-w-0">
            <h4 className="text-xs font-semibold truncate">{profile.name}</h4>
            <span className="text-[10px] text-muted font-mono">Profile Complete</span>
          </div>
        </div>

        {score < 90 && (
          <NavLink
            to={ROUTES.PROFILE}
            onClick={onNavigate}
            className="btn btn-sm btn-block mt-3 !text-[10px] bg-gold-500/10 text-gold-500 border border-gold-500/30 hover:bg-gold-500 hover:text-black"
          >
            Enhance Score →
          </NavLink>
        )}

        <button type="button" onClick={signOut} className="btn btn-sm btn-block btn-danger mt-3 !text-[10px]">
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
