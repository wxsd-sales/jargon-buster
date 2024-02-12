import { SvelteKitAuth } from '@auth/sveltekit';
import { MikroOrmAdapter } from '$lib/server/auth/mikro-orm-adpater';
import {
  AUTH_SECRET,
  WEBEX_AUTHORIZATION_CODE_CLIENT_ID,
  WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE,
  WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET
} from '$env/static/private';
import { defaultEntities } from '@auth/mikro-orm-adapter';
import WebexProvider from '$lib/server/auth/webex-provider';
import * as entities from '$database/entities';
import type { RequestEvent } from '@sveltejs/kit';
import type { SvelteKitAuthConfig } from '@auth/sveltekit';

const { User, Account, Session, VerificationToken } = { ...defaultEntities, ...entities };

function getMikroormAdapter(event: RequestEvent) {
  return MikroOrmAdapter(event.locals.db, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    entities: { User, Account, Session, VerificationToken }
  });
}

function getWebexProvider() {
  return WebexProvider({
    clientId: WEBEX_AUTHORIZATION_CODE_CLIENT_ID,
    clientSecret: WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET,
    authorization: {
      params: { prompt: 'select_account', scope: WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE }
    }
  });
}

const { handle, signIn, signOut } = SvelteKitAuth(async (event: RequestEvent) => {
  return {
    adapter: getMikroormAdapter(event),
    providers: [getWebexProvider()],
    secret: AUTH_SECRET,
    trustHost: true,
    pages: { signIn: '/' },
    callbacks: {
      session: async ({ session, user }) =>
        await event.locals.db.em
          .findOneOrFail(entities.User, user.id)
          .then((user) => (event.locals.user = user))
          .then(() => session)
    },
    events: {
      signOut: async () => (event.locals.user = undefined)
    }
  } satisfies SvelteKitAuthConfig;
});

export const authentication = handle;
export { signIn, signOut };
