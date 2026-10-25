import { useState } from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFeed } from '@/hooks/useCollections';
import { createPost, togglePostLike } from '@/firebase/communityService';
import { FEED_CATEGORIES } from '@/constants';
import { cn } from '@/utils/cn';
import { timeAgo } from '@/utils/format';
import PageContainer from '@/components/ui/PageContainer';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';

export default function CommunityPage() {
  const { user, profile } = useAuth();
  const addToast = useToast();
  const { data: posts, loading } = useFeed();
  const [text, setText] = useState('');
  const [category, setCategory] = useState(FEED_CATEGORIES[0]);
  const [filter, setFilter] = useState('All');
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      await createPost(user.uid, profile, { content: text.trim(), category });
      addToast('Post shared with the community!');
      setText('');
    } catch (error) {
      addToast(`Failed to share post: ${error.message}`);
    } finally {
      setPosting(false);
    }
  };

  const like = (post) =>
    togglePostLike(post.id, user.uid, post.likedBy?.includes(user.uid)).catch((e) => addToast(`Couldn't update like: ${e.message}`));

  const visible = filter === 'All' ? posts : posts.filter((p) => p.category === filter);

  return (
    <PageContainer width="lg">
      <div className="card p-5 space-y-3">
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} className="input text-xs" placeholder="Share tips, wins, or resources..." />
        <div className="flex justify-between items-center gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input !w-auto !py-1.5 text-xs">
            {FEED_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Button loading={posting} disabled={!text.trim()} onClick={submit}>Share Post</Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-line pb-3 text-xs">
        {['All', ...FEED_CATEGORIES].map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={cn('px-3 py-1 rounded-full transition-all', filter === c ? 'bg-gold-500 text-black font-semibold' : 'text-muted hover:text-fg')}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : visible.length === 0 ? (
        <p className="text-center text-xs text-muted py-8">No posts yet — be the first to share.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((post) => {
            const liked = post.likedBy?.includes(user.uid);
            return (
              <div key={post.id} className="card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar src={post.avatar} name={post.author} className="w-8 h-8" />
                  <div>
                    <h4 className="text-xs font-bold">{post.author}</h4>
                    <span className="text-[9px] text-faint font-mono">{timeAgo(post.createdAt)}</span>
                  </div>
                  <span className="badge badge-gold ml-auto font-bold">{post.category}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <div className="flex gap-4 pt-2 border-t border-line/50 text-xs text-faint font-mono">
                  <button type="button" onClick={() => like(post)} className={cn('flex items-center gap-1 hover:text-gold-500', liked && 'text-gold-500')}>
                    <Heart className={cn('w-4 h-4', liked && 'fill-gold-500')} />
                    {post.likes ?? 0} Likes
                  </button>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{post.comments ?? 0} Comments</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
