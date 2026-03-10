'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AuroraBackground from '@/components/aurora-background';
import Navbar from '@/components/shared/Navbar';
import SessionCard from '@/components/teen/SessionCard';

interface Session {
  id: string;
  created_at: string;
  mood_score: number;
  core_emotions: string[];
  crisis_flag: boolean;
}

export default function TeenHistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions?limit=30');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = sessions
    .slice()
    .reverse()
    .slice(-14)
    .map((session) => ({
      date: new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: session.mood_score,
    }));

  const moodEmojis: Record<number, string> = {
    1: '😭',
    3: '😔',
    5: '😐',
    7: '🙂',
    10: '😄'
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      <AuroraBackground />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-12 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#F1F5F9] mb-8">
          Your mood history
        </h1>

        {/* Mood Chart */}
        {chartData.length > 1 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-medium text-[#F1F5F9] mb-4">Mood over time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748B" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    stroke="#64748B" 
                    fontSize={12}
                    tickLine={false}
                    ticks={[1, 3, 5, 7, 10]}
                    tickFormatter={(value) => moodEmojis[value] || ''}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121218',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                    }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#7C3AED" 
                    strokeWidth={2}
                    dot={{ fill: '#7C3AED', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#A78BFA' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* All Sessions */}
        <div>
          <h2 className="text-xl font-semibold text-[#F1F5F9] mb-4">
            All sessions
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
              <p className="text-[#94A3B8]">
                No sessions yet. Start expressing yourself to see your history.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

