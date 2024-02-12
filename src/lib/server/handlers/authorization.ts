import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const authorization: Handle = async ({ event, resolve }) => {
  const session = await event.locals.auth();

  if (session == null && event.url.pathname !== '/' && !event.url.pathname.startsWith('/public')) {
    throw redirect(302, '/?callbackUrl=' + event.url);
  }

  if (session != null && event.url.pathname === '/') {
    throw redirect(302, '/terms');
  }

  return resolve(event);
};
