'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';

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

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const fetchSession = useCallback(async () => {
    try {
      // Check if token exists and is valid
      const { data: shareToken, error: tokenError } = await supabaseAdmin
        .from('share_tokens')
        .select('session_id, expires_at')
        .eq('token', token)
        .single();

      if (tokenError || !shareToken) {
        setError('Invalid share link');
        return;
      }

      // Check if expired
      if (new Date(shareToken.expires_at) < new Date()) {
        setExpired(true);
        return;
      }

      // Fetch session data
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('id', shareToken.session_id)
        .single();

      if (sessionError || !sessionData) {
        setError('Session not found');
        return;
      }

      setSession(sessionData);
    } catch (err) {
      console.error('Failed to fetch session:', err);
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            This report has expired.
          </h1>
          <p className="text-gray-500 mb-4">
            Share links are valid for 7 days.
          </p>
          <Link href="/" className="text-purple-600 hover:text-purple-700">
            Go to MindBridge →
          </Link>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Report not found
          </h1>
          <p className="text-gray-500">{error || 'Invalid link'}</p>
        </div>
      </div>
    );
  }

  const preparedDate = new Date(session.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const expiresDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MindBridge"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">MindBridge</span>
          </div>
          <p className="text-sm text-gray-500">
            Prepared on {preparedDate} · Expires {expiresDate}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Crisis Banner */}
        {session.crisis_flag && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="text-red-800 font-semibold">
                  This message contains crisis signals
                </h2>
                <p className="text-red-600 text-sm">
                  Please reach out today. Level: {session.crisis_level}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Translation Card */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What They&apos;re Feeling
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            {session.summary}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {session.core_emotions?.map((emotion, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700"
              >
                {emotion}
              </span>
            ))}
            <span className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-600">
              Intensity: {session.intensity_level}
            </span>
          </div>
          
          {session.underlying_needs?.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">What they actually need:</p>
              <div className="flex flex-wrap gap-2">
                {session.underlying_needs.map((need, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-teal-100 text-teal-700"
                  >
                    {need}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guide Card */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            How to Talk to Them
          </h2>
          
          {/* Say this / Not this */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="text-green-700 font-medium mb-3">✅ Say This</h4>
              <ul className="space-y-2">
                {session.what_to_say?.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm">{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4">
              <h4 className="text-red-700 font-medium mb-3">❌ Not This</h4>
              <ul className="space-y-2">
                {session.what_not_to_say?.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conversation starters */}
          {session.conversation_starters?.length > 0 && (
            <div>
              <h4 className="text-teal-600 font-medium mb-3">Conversation Starters</h4>
              <ol className="space-y-2">
                {session.conversation_starters.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex gap-2">
                    <span className="text-teal-600 font-medium">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Next steps */}
          {session.next_steps?.length > 0 && (
            <div>
              <h4 className="text-gray-600 font-medium mb-3">Next Steps</h4>
              <ul className="space-y-2">
                {session.next_steps.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                    <input type="checkbox" className="mt-1" readOnly />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Generated by MindBridge · mindbridge-arnavsen-projects.vercel.app
          </p>
        </div>
      </footer>
    </div>
  );
}

