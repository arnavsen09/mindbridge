'use client';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const moods = [
  { score: 1, emoji: '😭', label: 'Terrible' },
  { score: 3, emoji: '😔', label: 'Bad' },
  { score: 5, emoji: '😐', label: 'Okay' },
  { score: 7, emoji: '🙂', label: 'Good' },
  { score: 10, emoji: '😄', label: 'Great' },
];

export default function MoodSlider({ value, onChange }: MoodSliderProps) {
  return (
    <div className="space-y-4">
      <p className="text-xl text-[#F1F5F9] text-center">Right now, I&apos;m feeling...</p>
      
      <div className="flex justify-center gap-3">
        {moods.map((mood) => (
          <button
            key={mood.score}
            onClick={() => onChange(mood.score)}
            className={`
              text-5xl p-3 rounded-2xl transition-all duration-300
              hover:scale-110 hover:bg-white/5
              ${value === mood.score 
                ? 'scale-125 ring-2 ring-[#7C3AED] bg-[#7C3AED]/20' 
                : 'opacity-60 hover:opacity-100'}
            `}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      
      <p className="text-center text-[#94A3B8] text-sm">
        {moods.find(m => m.score === value)?.label || 'Select how you feel'}
      </p>
    </div>
  );
}

