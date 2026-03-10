'use client';

interface EmotionBadgeProps {
  emotion: string;
  variant?: 'default' | 'soft';
}

const emotionColors: Record<string, string> = {
  sad: 'bg-blue-500/20 text-blue-400',
  anxious: 'bg-yellow-500/20 text-yellow-400',
  angry: 'bg-red-500/20 text-red-400',
  happy: 'bg-green-500/20 text-green-400',
  excited: 'bg-orange-500/20 text-orange-400',
  scared: 'bg-purple-500/20 text-purple-400',
  frustrated: 'bg-red-500/20 text-red-400',
  lonely: 'bg-gray-500/20',
  hopeful: 'bg-teal-500/20 text-teal-400',
  confused: 'bg-indigo-500/20 text-indigo-400',
};

export default function EmotionBadge({ emotion, variant = 'default' }: EmotionBadgeProps) {
  const normalizedEmotion = emotion.toLowerCase();
  const colorClass = emotionColors[normalizedEmotion] || 'bg-[#7C3AED]/20 text-[#A78BFA]';
  
  if (variant === 'soft') {
    return (
      <span className="px-3 py-1 text-sm rounded-full bg-white/5 text-[#94A3B8]">
        {emotion}
      </span>
    );
  }
  
  return (
    <span className={`px-3 py-1 text-sm rounded-full ${colorClass}`}>
      {emotion}
    </span>
  );
}

