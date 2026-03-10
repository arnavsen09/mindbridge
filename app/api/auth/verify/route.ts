import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSessionToken, setSessionCookie, upsertUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth?error=invalid', request.url));
    }

    // Find magic link in database
    const { data: magicLink, error: findError } = await supabaseAdmin
      .from('magic_links')
      .select('*')
      .eq('token', token)
      .single();

    if (findError || !magicLink) {
      return NextResponse.redirect(new URL('/auth?error=invalid', request.url));
    }

    // Validate magic link data
    if (!magicLink.email || !magicLink.role) {
      return NextResponse.redirect(new URL('/auth?error=invalid', request.url));
    }

    // Check if expired
    if (new Date(magicLink.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/auth?error=expired', request.url));
    }

    // Check if already used
    if (magicLink.used) {
      return NextResponse.redirect(new URL('/auth?error=used', request.url));
    }

    // Mark as used
    await supabaseAdmin
      .from('magic_links')
      .update({ used: true })
      .eq('token', token);

    // Upsert user
    const user = await upsertUser(magicLink.email, magicLink.role);

    // Create session token
    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    await setSessionCookie(sessionToken);

    // Redirect to appropriate dashboard
    const redirectUrl = magicLink.role === 'teen' 
      ? '/teen' 
      : '/adult';

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.redirect(new URL('/auth?error=invalid', request.url));
  }
}

