'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuroraBackground from '@/components/aurora-background';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

function AuthForm() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'teen' | 'adult'>(
    (searchParams.get('role') as 'teen' | 'adult') || 'teen'
  );
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'teen' || roleParam === 'adult') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">
          Check your inbox.
        </h2>
        <p className="text-[#94A3B8]">
          Your link expires in 15 minutes — no password needed, ever.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Toggle */}
      <div className="flex bg-white/5 rounded-full p-1">
        <button
          type="button"
          onClick={() => setRole('teen')}
          className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ${
            role === 'teen'
              ? 'bg-[#7C3AED] text-white'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          I&apos;m a Teen
        </button>
        <button
          type="button"
          onClick={() => setRole('adult')}
          className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ${
            role === 'adult'
              ? 'bg-[#7C3AED] text-white'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          I&apos;m a Parent or Counselor
        </button>
      </div>

      {/* Email Input */}
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={`w-full px-4 py-4 rounded-xl bg-white/5 border ${
            error ? 'border-red-500' : 'border-white/10'
          } text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] transition-colors`}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Sending...</span>
          </>
        ) : (
          'Send my magic link →'
        )}
      </button>

      <p className="text-center text-sm text-[#64748B]">
        All languages welcome 🌍
      </p>
    </form>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] relative flex items-center justify-center p-4">
      <AuroraBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#F1F5F9] mb-2">
              Welcome to MindBridge
            </h1>
            <p className="text-[#94A3B8]">
              Sign in with a magic link — no password needed
            </p>
          </div>
          
          <Suspense fallback={<div className="text-center text-[#94A3B8]">Loading...</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

