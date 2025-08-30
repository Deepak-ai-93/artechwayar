import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-development';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This can happen if the token is expired or invalid
    return null;
  }
}

export async function setSession(sessionData: { user: { username: string }; isLoggedIn: boolean }) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ ...sessionData, expires });

  cookies().set('session', session, { expires, httpOnly: true });
}

export async function getSession() {
  const cookie = cookies().get('session')?.value;
  if (!cookie) {
    return { isLoggedIn: false };
  }
  const session = await decrypt(cookie);
  if (!session) {
    return { isLoggedIn: false };
  }
  return session;
}

export async function deleteSession() {
  cookies().delete('session');
}
