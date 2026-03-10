'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuroraBackground from '@/components/aurora-background';
import Navbar from '@/components/shared/Navbar';
import SessionCard from '@/components/teen/SessionCard';
import CrisisModal from '@/components/teen/CrisisModal';

interface Session {
  id: string;
  created_at: string;
  mood_score: number;
  core_emotions: string[];
  crisis_flag: boolean;
}

export default function TeenDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions?limit=3');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastEmotion = sessions[0]?.core_emotions?.[0];

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      <AuroraBackground />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-12 max-w-4xl mx-auto px-6">
        {/* Greeting Card */}
        <div className="bg-white/5 backdrop-blur-md border border-[#7C3AED]/30 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#F1F5F9] mb-2">
            Hey. How are you holding up?
          </h1>
          {lastEmotion ? (
            <p className="text-[#94A3B8] mb-6">
              Last time you were feeling {lastEmotion}. Things change. Talk when ready.
            </p>
          ) : (
            <p className="text-[#94A3B8] mb-6">
              This is your space. No judgment, ever.
            </p>
          )}
          
          <Link
            href="/teen/express"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Say something →
          </Link>
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">
            Recent sessions
          </h2>
          
          {loading ? (
            <div className="text-center py-8 text-[#94A3B8]">
              Loading...
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
              <Image
                src="/Gemini_Generated_Image_vka71nvka71nvka7 (2).png"
                alt="Nothing here yet"
                width={200}
                height={200}
                className="mx-auto mb-4 rounded-xl opacity-50"
              />
              <p className="text-[#94A3B8]">
                Nothing here yet. Whenever you&apos;re ready, we&apos;re listening.
              </p>
            </div>
          )}
        </div>

        {/* History Link */}
        {sessions.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href="/teen/history"
              className="text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
            >
              View all sessions →
            </Link>
          </div>
        )}
      </main>

      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
    </div>
  );
}

