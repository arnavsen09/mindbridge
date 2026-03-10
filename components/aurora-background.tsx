'use client';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Aurora 1 - Purple */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] animate-aurora-1"
        style={{ top: '-100px', left: '-100px' }}
      />
      
      {/* Aurora 2 - Teal */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-[100px] animate-aurora-2"
        style={{ top: '20%', right: '-80px' }}
      />
      
      {/* Aurora 3 - Indigo */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[90px] animate-aurora-3"
        style={{ bottom: '10%', left: '30%' }}
      />
      
      {/* Aurora 4 - Emerald */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full bg-emerald-500/15 blur-[80px] animate-aurora-4"
        style={{ bottom: '-50px', right: '20%' }}
      />
    </div>
  );
}

