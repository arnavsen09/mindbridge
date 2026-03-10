'use client';

interface GuideCardProps {
  whatToSay: string[];
  whatNotToSay: string[];
  conversationStarters: string[];
  nextSteps: string[];
  toneGuidance: string;
}

export default function GuideCard({ 
  whatToSay, 
  whatNotToSay, 
  conversationStarters, 
  nextSteps,
  toneGuidance 
}: GuideCardProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-[#F1F5F9]">
        How to talk to them
      </h3>
      
      {/* Two columns: Say this / Not this */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
            <span>✅</span> Say this
          </h4>
          <ul className="space-y-2">
            {whatToSay.map((item, i) => (
              <li key={i} className="text-[#F1F5F9] text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
            <span>❌</span> Not this
          </h4>
          <ul className="space-y-2">
            {whatNotToSay.map((item, i) => (
              <li key={i} className="text-[#F1F5F9] text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Conversation starters */}
      {conversationStarters.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-4">
          <h4 className="text-[#0D9488] font-medium mb-3">Conversation starters</h4>
          <ol className="space-y-2">
            {conversationStarters.map((item, i) => (
              <li key={i} className="text-[#F1F5F9] text-sm flex gap-2">
                <span className="text-[#0D9488] font-medium">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
      
      {/* Next steps */}
      {nextSteps.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-4">
          <h4 className="text-[#94A3B8] font-medium mb-3">Next steps</h4>
          <ul className="space-y-2">
            {nextSteps.map((item, i) => (
              <li key={i} className="text-[#F1F5F9] text-sm flex items-start gap-2">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-white/20 bg-white/5" 
                  readOnly 
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Tone guidance */}
      {toneGuidance && (
        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-2xl p-4">
          <h4 className="text-[#A78BFA] font-medium mb-2">Tone guidance</h4>
          <p className="text-[#F1F5F9] text-sm">{toneGuidance}</p>
        </div>
      )}
    </div>
  );
}

