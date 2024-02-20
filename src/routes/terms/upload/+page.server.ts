import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { Alias, Explanation, Term } from '$database/entities';
import { redirect } from '@sveltejs/kit';
import { wrap } from '@mikro-orm/core';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  save: async (event: RequestEvent) => {
    const json = await event.request.formData().then((e) => JSON.parse(e.get('parsed') as string));

    const [createdBy, updatedBy] = [event.locals.user, event.locals.user];
    const byFields = { createdBy, updatedBy };
    const onConflictExcludeFields = ['id', 'createdBy', 'createdAt'];

    await event.locals.db.em.transactional(async (em) => {
      const terms = (json ?? [])
        .map((r: { [x: string]: string }) => {
          const letters = r['TERM']?.trim();
          return letters?.length !== 0
            ? wrap(new Term({ orgId: 'wxsd.us', letters })).assign(byFields)
            : undefined;
        })
        .filter((r?: Term) => r?.letters != null);
      await em.upsertMany(Term, terms, {
        onConflictFields: ['orgId', 'letters'],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onConflictExcludeFields
      });

      const aliases = (json ?? [])
        .map((r: { [x: string]: string }, i: number) => {
          const term = terms[i];
          const letters = r['ALIAS']?.trim();

          return letters?.length !== 0
            ? wrap(new Alias({ term, letters, priority: 0 })).assign(byFields)
            : undefined;
        })
        .filter((r?: Alias) => r?.letters != null);

      const explanations = (json ?? [])
        .map((r: { [x: string]: string }, i: number) => {
          const term = terms[i];
          const context = r['EXPLANATION_CONTEXT']?.trim();
          const text = r['EXPLANATION_TEXT']?.trim();

          return context?.length !== 0
            ? wrap(
                new Explanation({ term, context, text: text.length !== 0 ? text : undefined })
              ).assign(byFields)
            : undefined;
        })
        .filter((r?: Explanation) => r?.context != null);

      await em.upsertMany(Alias, aliases, {
        onConflictFields: ['term', 'letters'],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onConflictExcludeFields
      });
      await em.upsertMany(Explanation, explanations, {
        onConflictFields: ['term', 'context'],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onConflictExcludeFields
      });
    });

    await event.locals.db.em.flush();

    throw redirect(303, '/terms');
  }
};
