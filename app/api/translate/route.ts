import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { runFullTranslationPipeline } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const session = await requireAuth('teen');

    // Get request body
    const { text, moodScore, recipientType } = await request.json();

    if (!text || !moodScore || !recipientType) {
      return NextResponse.json(
        { error: 'Text, mood score, and recipient type are required' },
        { status: 400 }
      );
    }

    // Validate text length
    const sanitizedText = text.replace(/<[^>]*>/g, '').trim();
    if (sanitizedText.length < 50) {
      return NextResponse.json(
        { error: 'Text must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (sanitizedText.length > 2000) {
      return NextResponse.json(
        { error: 'Text must be less than 2000 characters' },
        { status: 400 }
      );
    }

    // Check rate limit (5 requests per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.userId)
      .gte('created_at', oneHourAgo);

    if (count && count >= 5) {
      return NextResponse.json(
        { error: 'Take a breath. Try again in a little while. 💜' },
        { status: 429 }
      );
    }

    // Run AI pipeline
    const result = await runFullTranslationPipeline(sanitizedText);

    // Save session to database
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert({
        user_id: session.userId,
        raw_text: sanitizedText,
        mood_score: moodScore,
        recipient_type: recipientType,
        crisis_flag: result.crisis.crisis_flag,
        crisis_level: result.crisis.crisis_level,
        crisis_reason: result.crisis.crisis_reason,
        summary: result.emotion.summary,
        core_emotions: result.emotion.core_emotions,
        underlying_needs: result.emotion.underlying_needs,
        triggers: result.emotion.triggers,
        intensity_level: result.emotion.intensity_level,
        what_to_say: result.guide.what_to_say,
        what_not_to_say: result.guide.what_not_to_say,
        conversation_starters: result.guide.conversation_starters,
        next_steps: result.guide.next_steps,
        tone_guidance: result.guide.tone_guidance,
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Save session error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to save session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      session: sessionData,
      crisis: result.crisis,
    });
  } catch (error) {
    console.error('Translate error:', error);
    
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

