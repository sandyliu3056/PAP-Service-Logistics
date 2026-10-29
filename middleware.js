// 整個網站的登入保護（Vercel Routing Middleware，Basic Auth）。
// 帳號 sandy，密碼與 Acer Guide 相同；這裡只存密碼的 SHA-256 雜湊值。
export const config = { matcher: '/(.*)' };

const USER = 'sandy';
const PASS_SHA256 = 'bb56ddfb82c86a3ad9e44f42218ea3394831f2e0d5f0563f68c5f3614be9a882';

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function middleware(request) {
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const [user, ...rest] = atob(auth.slice(6)).split(':');
      if (user === USER && (await sha256(rest.join(':'))) === PASS_SHA256) return; // 通過
    } catch (e) { /* 格式不對就當作沒登入 */ }
  }
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="PAP Service Logistics", charset="UTF-8"' },
  });
}
