import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendMagicLinkEmail } from '@/lib/resend';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    if (!['teen', 'adult'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // For development: only allow sending to owner's email due to Resend testing restrictions
    if (email !== 'arnavsen2009@gmail.com') {
      return NextResponse.json(
        { error: 'For testing purposes, only the owner email (arnavsen2009@gmail.com) is allowed. Please verify a domain in Resend to send to other addresses.' },
        { status: 403 }
      );
    }

    // Generate token using Web Crypto API (works in Node.js)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    // Insert magic link into database
    const { error: insertError } = await supabaseAdmin
      .from('magic_links')
      .insert({
        email,
        token,
        role,
        expires_at: expiresAt,
        used: false,
      });

    if (insertError) {
      console.error('Insert magic link error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create magic link' },
        { status: 500 }
      );
    }

    // Send email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const magicLink = `${appUrl}/api/auth/verify?token=${token}`;

    await sendMagicLinkEmail(email, magicLink, role);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send magic link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

