import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete('admin-session', { path: '/' });
  return new Response(null, { status: 302, headers: { Location: '/admin' } });
};