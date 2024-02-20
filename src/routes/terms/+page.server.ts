import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { Term } from '$database/entities';
import { LoadStrategy, QueryOrder, serialize } from '@mikro-orm/core';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const glossary = await event.locals.db.em
    .find(
      Term,
      { orgId: 'wxsd.us' },
      {
        fields: [
          'id',
          'letters',
          'aliases',
          'explanations',
          'createdAt',
          'updatedAt',
          'createdBy',
          'updatedBy'
        ],
        strategy: LoadStrategy.JOINED,
        orderBy: { letters: QueryOrder.ASC }
      }
    )
    .then((r) => serialize(r, { populate: ['aliases', 'explanations', 'createdBy', 'updatedBy'] }));

  return { glossary };
};

export const actions: Actions = {
  delete: async (event: RequestEvent) => {
    throw redirect(303, '/terms');
  }
};
