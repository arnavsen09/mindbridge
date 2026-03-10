'use client';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        style={{ background: 'rgba(0, 0, 0, 0.9)' }}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 max-w-lg w-full mx-4 p-6">
        <div className="bg-[#121218] border border-red-500/30 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            You&apos;re not alone in this. 💜
          </h2>
          
          <p className="text-[#94A3B8] mb-8">
            What you&apos;re feeling is real. Here&apos;s who can help right now:
          </p>
          
          {/* Helpline Cards */}
          <div className="space-y-3 mb-8">
            <a 
              href="tel:9152987821"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-white font-medium">iCall India</p>
                <p className="text-[#94A3B8] text-sm">9152987821</p>
              </div>
            </a>
            
            <a 
              href="tel:18602662345"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-white font-medium">Vandrevala Foundation</p>
                <p className="text-[#94A3B8] text-sm">1860-2662-345</p>
              </div>
            </a>
            
            <a 
              href="sms:741741&body=HOME"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="text-white font-medium">Crisis Text Line</p>
                <p className="text-[#94A3B8] text-sm">Text HOME to 741741</p>
              </div>
            </a>
            
            <a 
              href="tel:4422006"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-white font-medium">iMind</p>
                <p className="text-[#94A3B8] text-sm">4422006</p>
              </div>
            </a>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <a 
              href="tel:9152987821"
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Call Now
            </a>
            
            <button 
              onClick={onClose}
              className="w-full py-3 text-[#94A3B8] hover:text-white transition-colors text-sm"
            >
              I&apos;m safe for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

