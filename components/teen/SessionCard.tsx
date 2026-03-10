'use client';

interface SessionCardProps {
  session: {
    id: string;
    created_at: string;
    mood_score: number;
    core_emotions: string[];
    crisis_flag: boolean;
  };
}

const moodEmojis: Record<number, string> = {
  1: '😭',
  3: '😔',
  5: '😐',
  7: '🙂',
  10: '😄'
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default function SessionCard({ session }: SessionCardProps) {
  const emoji = moodEmojis[session.mood_score] || '😐';
  
  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:-rotate-1 hover:border-white/20 transition-all duration-300">
      {session.crisis_flag && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
      
      <div className="flex items-center gap-4">
        <span className="text-4xl">{emoji}</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 mb-1">
            {session.core_emotions?.slice(0, 3).map((emotion, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-[#7C3AED]/20 text-[#A78BFA]"
              >
                {emotion}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-[#94A3B8]">
            {formatDate(session.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

