'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuroraBackground from '@/components/aurora-background';
import Navbar from '@/components/shared/Navbar';
import EmotionBadge from '@/components/adult/EmotionBadge';

interface Session {
  id: string;
  created_at: string;
  core_emotions: string[];
  crisis_flag: boolean;
  summary: string;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default function AdultDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      <div className="fixed inset-0 pointer-events-none opacity-15">
        <AuroraBackground />
      </div>
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-12 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#F1F5F9] mb-2">
            Your MindBridge
          </h1>
          <p className="text-[#94A3B8]">
            When a teen shares with you, it shows up here.
          </p>
        </div>

        {/* Sessions */}
        {loading ? (
          <div className="text-center py-8 text-[#94A3B8]">Loading...</div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {session.crisis_flag && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          Crisis
                        </span>
                      )}
                      <span className="text-sm text-[#94A3B8]">
                        {formatRelativeTime(session.created_at)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {session.core_emotions?.slice(0, 3).map((emotion, i) => (
                        <EmotionBadge key={i} emotion={emotion} />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-[#F1F5F9] line-clamp-2 mb-4">
                  {session.summary}
                </p>
                
                <Link
                  href={`/adult/view/${session.id}`}
                  className="inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                >
                  Read their message →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <Image
              src="/Gemini_Generated_Image_vka71nvka71nvka7 (3).png"
              alt="Nobody's shared with you yet"
              width={200}
              height={200}
              className="mx-auto mb-4 rounded-xl opacity-50"
            />
            <p className="text-[#94A3B8] mb-2">
              Nobody&apos;s shared with you yet.
            </p>
            <p className="text-[#64748B] text-sm mb-4">
              Share your unique link with the teen in your care.
            </p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="Your invite link will appear here"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"
                readOnly
              />
              <button
                onClick={copyInviteLink}
                disabled={!inviteLink}
                className="px-4 py-3 bg-[#7C3AED] text-white rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

