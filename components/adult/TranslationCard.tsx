'use client';

interface TranslationCardProps {
  summary: string;
  coreEmotions: string[];
  underlyingNeeds: string[];
  triggers: string[];
  intensityLevel: string;
}

export default function TranslationCard({ 
  summary, 
  coreEmotions, 
  underlyingNeeds, 
  triggers,
  intensityLevel 
}: TranslationCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border-l-4 border-[#7C3AED] rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-[#F1F5F9] mb-4">
        What they&apos;re feeling
      </h3>
      
      <p className="text-lg text-[#F1F5F9] leading-relaxed mb-4">
        {summary}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {coreEmotions.map((emotion, i) => (
          <span 
            key={i}
            className="px-3 py-1 text-sm rounded-full bg-[#7C3AED]/20 text-[#A78BFA]"
          >
            {emotion}
          </span>
        ))}
        <span className="px-3 py-1 text-sm rounded-full bg-white/5 text-[#94A3B8]">
          Intensity: {intensityLevel}
        </span>
      </div>
      
      {underlyingNeeds.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-[#94A3B8] mb-2">What they actually need:</p>
          <div className="flex flex-wrap gap-2">
            {underlyingNeeds.map((need, i) => (
              <span 
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-[#0D9488]/20 text-[#2DD4BF]"
              >
                {need}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {triggers.length > 0 && (
        <div>
          <p className="text-sm text-[#64748B] italic mb-2">What&apos;s behind it:</p>
          <p className="text-sm text-[#94A3B8] italic">
            {triggers.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

