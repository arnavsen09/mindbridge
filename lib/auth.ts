import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase';

const JWT_SECRET = process.env.MAGIC_LINK_SECRET || 'mindbridge-secret-key';
const COOKIE_NAME = 'mb_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'teen' | 'adult';
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET));
  
  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAuth(requiredRole?: 'teen' | 'adult'): Promise<SessionPayload> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (requiredRole && session.role !== requiredRole) {
    throw new Error('Forbidden');
  }
  
  return session;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUserByEmail(email: string) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  return user;
}

export async function upsertUser(email: string, role: 'teen' | 'adult') {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .upsert(
      { email, role },
      { onConflict: 'email' }
    )
    .select()
    .single();
  
  if (error) throw error;
  return user;
}

