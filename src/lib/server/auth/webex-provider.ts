import type { OAuthConfig, OAuthUserConfig } from '@auth/core/providers';
import type { Profile } from '@auth/core/types';
import { WEBEX_API_URL } from '$env/static/private';

export interface WebexProfile extends Profile {
  id: string;
  emails: [string, ...string[]];
  displayName: string;
  avatar: string;
}

export default function WebexProvider<P extends WebexProfile>(
  config: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'webex',
    name: 'Webex',
    type: 'oauth',
    authorization: {
      url: WEBEX_API_URL + '/authorize',
      params: { scope: 'spark:kms spark:people_read' }
    },
    token: WEBEX_API_URL + '/access_token',
    userinfo: WEBEX_API_URL + '/people/me',
    profile: (profile) => ({
      id: profile.id,
      email: profile.emails[0],
      name: profile.displayName,
      image: profile.avatar
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    options: config
  };
}
