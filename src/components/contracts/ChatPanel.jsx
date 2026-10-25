import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useContractMessages } from '@/hooks/useCollections';
import { sendContractMessage } from '@/firebase/contractService';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';

export default function ChatPanel({ contractId }) {
  const { user, profile } = useAuth();
  const addToast = useToast();
  const { data: messages } = useContractMessages(contractId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      await sendContractMessage(contractId, { uid: user.uid, name: profile.name }, trimmed);
      setText('');
    } catch (error) {
      console.error(error);
      addToast(`Message failed: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card p-5 flex flex-col h-80">
      <div className="overflow-y-auto space-y-2 border-b border-line pb-3 flex-1 pr-1">
        <div className="bg-panel p-2 rounded text-[10px] text-gold-500 font-mono italic">
          Keep all transaction discussions inside TalentStage.
        </div>

        {messages.map((msg) => {
          const mine = msg.senderId === user.uid;
          const system = msg.senderId === 'system';
          return (
            <div
              key={msg.id}
              className={cn(
                'p-2 rounded text-xs max-w-xs',
                system ? 'bg-gold-500/5 border border-gold-500/20 text-gold-500 mx-auto text-center max-w-sm' : mine ? 'bg-raised ml-auto text-right' : 'bg-panel'
              )}
            >
              {!system && <span className="text-[9px] text-faint font-mono block">{mine ? 'Me' : msg.senderName}</span>}
              <span>{msg.text}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="input !py-1.5 text-xs"
        />
        <Button type="submit" loading={sending} disabled={!text.trim()} aria-label="Send message" className="!px-3">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
