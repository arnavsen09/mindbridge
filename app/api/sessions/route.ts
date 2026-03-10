import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (session.role === 'teen') {
      // Teen can only see their own sessions
      const { data, error } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('user_id', session.userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get teen sessions error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch sessions' },
          { status: 500 }
        );
      }

      return NextResponse.json({ sessions: data });
    } else {
      // Adult can see sessions shared with them
      const { data, error } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('recipient_email', session.email)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get adult sessions error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch sessions' },
          { status: 500 }
        );
      }

      return NextResponse.json({ sessions: data });
    }
  } catch (error) {
    console.error('Get sessions error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

