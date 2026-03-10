'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuroraBackground from '@/components/aurora-background';
import Navbar from '@/components/shared/Navbar';
import MoodSlider from '@/components/teen/MoodSlider';
import ExpressionInput from '@/components/teen/ExpressionInput';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import CrisisModal from '@/components/teen/CrisisModal';

type RecipientType = 'parent' | 'counselor' | 'therapist';

const recipientLabels: Record<RecipientType, { emoji: string; label: string }> = {
  parent: { emoji: '👨‍👩‍👧', label: 'My Parent / Guardian' },
  counselor: { emoji: '📚', label: 'My School Counselor' },
  therapist: { emoji: '🌿', label: 'My Therapist' },
};

export default function ExpressPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [moodScore, setMoodScore] = useState(5);
  const [expression, setExpression] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [error, setError] = useState('');

  const minChars = 50;
  const canProceed = expression.length >= minChars;

  const handleSubmit = async () => {
    if (!canProceed || !recipientType) return;
    
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: expression,
          moodScore,
          recipientType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error.includes('breath') || data.error.includes('💜')) {
          setError(data.error);
          return;
        }
        throw new Error(data.error || 'Something went wrong');
      }

      // Check for crisis
      if (data.crisis?.crisis_level === 'medium' || data.crisis?.crisis_level === 'high') {
        setShowCrisisModal(true);
        return;
      }

      // Success - redirect to teen dashboard
      router.push('/teen');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      <AuroraBackground />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-12 max-w-2xl mx-auto px-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step
                  ? 'bg-[#7C3AED] scale-125'
                  : s < step
                  ? 'bg-[#0D9488]'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Mood */}
        {step === 1 && (
          <div className="space-y-8">
            <MoodSlider value={moodScore} onChange={setMoodScore} />
            
            <div className="flex justify-center">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Expression */}
        {step === 2 && (
          <div className="space-y-8">
            <ExpressionInput value={expression} onChange={setExpression} />
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-[#94A3B8] hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed}
                className="px-8 py-3 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Recipient */}
        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-[#F1F5F9] text-center">
              Who do you want to understand you?
            </h2>
            
            <div className="space-y-3">
              {(Object.keys(recipientLabels) as RecipientType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setRecipientType(type)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all ${
                    recipientType === type
                      ? 'border-[#7C3AED] bg-[#7C3AED]/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl mr-3">{recipientLabels[type].emoji}</span>
                  <span className="text-[#F1F5F9] font-medium">
                    {recipientLabels[type].label}
                  </span>
                </button>
              ))}
            </div>

            {error && (
              <p className="text-center text-red-400">{error}</p>
            )}
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="px-6 py-3 text-[#94A3B8] hover:text-white transition-colors disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!recipientType || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Reading between the lines...</span>
                  </>
                ) : (
                  'Send it →'
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <CrisisModal isOpen={showCrisisModal} onClose={() => router.push('/teen')} />
    </div>
  );
}

