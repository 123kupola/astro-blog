import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const isLoggedIn = cookies.get('admin-session')?.value === 'true';
  return new Response(JSON.stringify({ loggedIn: isLoggedIn }), {
    headers: { 'Content-Type': 'application/json' },
  });
};