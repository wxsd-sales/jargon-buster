import { Account, Term } from '$database/entities';
import { LoadStrategy, QueryOrder, serialize } from '@mikro-orm/core';
// import { PUBLIC_ACCESS_TOKEN } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const accessToken = await event.locals.db.em
    .findOne(Account, { user: event.locals.user }, { orderBy: { expires_at: 'desc' } })
    .then((r) => r?.access_token);
  // const accessToken = PUBLIC_ACCESS_TOKEN;
  const glossary = await event.locals.db.em
    .find(
      Term,
      { orgId: 'wxsd.us' },
      {
        fields: ['id', 'letters', 'aliases', 'explanations'],
        strategy: LoadStrategy.JOINED,
        orderBy: { createdAt: QueryOrder.DESC }
      }
    )
    .then((r) => serialize(r, { populate: ['aliases', 'explanations'] }));

  return { accessToken, glossary };
};
