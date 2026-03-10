'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import AuroraBackground from '@/components/aurora-background';
import Navbar from '@/components/shared/Navbar';
import TranslationCard from '@/components/adult/TranslationCard';
import GuideCard from '@/components/adult/GuideCard';

interface Session {
  id: string;
  created_at: string;
  raw_text: string;
  mood_score: number;
  crisis_flag: boolean;
  crisis_level: string;
  summary: string;
  core_emotions: string[];
  underlying_needs: string[];
  triggers: string[];
  intensity_level: string;
  what_to_say: string[];
  what_not_to_say: string[];
  conversation_starters: string[];
  next_steps: string[];
  tone_guidance: string;
}

export default function ViewSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      // In a real app, we'd fetch from an API
      // For now, we'll simulate with localStorage or mock data
      const res = await fetch(`/api/sessions?limit=100`);
      const data = await res.json();
      const found = data.sessions?.find((s: Session) => s.id === sessionId);
      setSession(found || null);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const generateShareLink = async () => {
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = async () => {
    if (!session) return;
    
    // For PDF generation, we'd use the PDFReport component
    // This is a simplified version
    alert('PDF download would be generated here. In production, use @react-pdf/renderer properly configured.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] relative">
        <AuroraBackground />
        <Navbar />
        <div className="relative z-10 pt-24 text-center text-[#94A3B8]">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] relative">
        <AuroraBackground />
        <Navbar />
        <div className="relative z-10 pt-24 text-center">
          <p className="text-[#94A3B8]">Session not found</p>
          <Link href="/adult" className="text-[#7C3AED] hover:text-[#A78BFA]">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      <AuroraBackground />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-32 max-w-4xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/adult"
          className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white mb-6"
        >
          ← Back to dashboard
        </Link>

        {/* Crisis Banner */}
        {session.crisis_flag && (
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="text-white font-semibold">
                  This message contains crisis signals
                </h2>
                <p className="text-white/80 text-sm">
                  Please reach out today. Level: {session.crisis_level}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Translation Card */}
        <TranslationCard
          summary={session.summary}
          coreEmotions={session.core_emotions || []}
          underlyingNeeds={session.underlying_needs || []}
          triggers={session.triggers || []}
          intensityLevel={session.intensity_level || 'mild'}
        />

        {/* Guide Card */}
        <div className="mt-8">
          <GuideCard
            whatToSay={session.what_to_say || []}
            whatNotToSay={session.what_not_to_say || []}
            conversationStarters={session.conversation_starters || []}
            nextSteps={session.next_steps || []}
            toneGuidance={session.tone_guidance || ''}
          />
        </div>

        {/* Raw Expression (collapsible) */}
        <details className="mt-8 bg-white/5 border border-white/10 rounded-2xl">
          <summary className="p-4 cursor-pointer text-[#94A3B8] hover:text-white">
            View original expression
          </summary>
          <div className="px-4 pb-4">
            <p className="text-[#F1F5F9] whitespace-pre-wrap">{session.raw_text}</p>
          </div>
        </details>
      </main>

      {/* Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0F]/90 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          {!shareUrl ? (
            <button
              onClick={generateShareLink}
              className="flex-1 py-3 bg-[#7C3AED] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Generate shareable report
            </button>
          ) : (
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F1F5F9] text-sm"
              />
              <button
                onClick={copyShareLink}
                className="px-4 py-3 bg-[#7C3AED] text-white rounded-xl hover:opacity-90"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
          
          <button
            onClick={downloadPDF}
            className="px-6 py-3 border border-white/20 text-[#F1F5F9] font-medium rounded-xl hover:bg-white/5 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

