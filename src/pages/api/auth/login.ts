import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  const contentType = request.headers.get('content-type') || '';
  let email: string, password: string;

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    email = params.get('email') || '';
    password = params.get('password') || '';
  } else {
    const data = await request.formData();
    email = data.get('email') as string;
    password = data.get('password') as string;
  }

  const adminEmail = import.meta.env.ADMIN_EMAIL || 'admin@test.com';
  const adminPassword = import.meta.env.ADMIN_PASSWORD || 'testtest';

  if (email === adminEmail && password === adminPassword) {
    // Set a simple session cookie
    cookies.set('admin-session', 'true', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return new Response(null, { status: 302, headers: { Location: '/admin/dashboard' } });
  } else {
    return new Response('Invalid credentials', { status: 401 });
  }
};