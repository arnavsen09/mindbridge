'use client';

interface ExpressionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ExpressionInput({ value, onChange }: ExpressionInputProps) {
  const minChars = 50;
  const maxChars = 2000;
  const charCount = value.length;
  const isValid = charCount >= minChars && charCount <= maxChars;

  return (
    <div className="space-y-4">
      <p className="text-xl text-[#F1F5F9] text-center">Tell us what&apos;s on your mind...</p>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
          placeholder="Just say it. No one's going to judge you here."
          className={`
            w-full h-64 p-4 rounded-2xl bg-white/5 border border-white/10 
            text-[#F1F5F9] placeholder-[#64748B] resize-none
            focus:outline-none focus:border-[#7C3AED] transition-all duration-300
            leading-relaxed
            ${value.length > 0 ? 'shadow-[0_0_30px_rgba(124,58,237,0.1)]' : ''}
          `}
        />
        
        {/* Character count */}
        <div className={`absolute bottom-3 right-4 text-sm ${
          isValid ? 'text-[#0D9488]' : charCount > maxChars ? 'text-red-500' : 'text-[#64748B]'
        }`}>
          {charCount} / {maxChars}
        </div>
      </div>
      
      {charCount > 0 && charCount < minChars && (
        <p className="text-center text-[#94A3B8] text-sm">
          Write a bit more ({minChars - charCount} more characters needed)
        </p>
      )}
    </div>
  );
}

