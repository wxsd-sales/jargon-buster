import { Alias, Explanation, Term } from '$database/entities';
import { fail, redirect } from '@sveltejs/kit';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength, ValidateIf, validateSync } from 'class-validator';
import {
  CLASS_TRANSFORMER_OPTIONS,
  CLASS_VALIDATOR_OPTIONS,
  TO_CLASS_ONLY
} from '$lib/constants/common';
import { wrap } from '@mikro-orm/core';
import type { PageServerLoad, Actions, RequestEvent } from './$types';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  save: async (event: RequestEvent) => {
    class FormDataDTO {
      static emptyToUndefined = (r?: string | FormDataEntryValue) => {
        const s = r?.toString().trim();
        return s != null && s.length > 0 ? s : undefined;
      };

      @Expose()
      @IsNotEmpty()
      @MinLength(2)
      @MaxLength(64)
      @Transform(({ obj }: { obj: FormData }) => obj.get('letters'), TO_CLASS_ONLY)
      public readonly letters!: string;

      @Expose()
      @MinLength(2, { each: true })
      @MaxLength(64, { each: true })
      @ValidateIf(({ obj }) => obj?.aliases)
      @Transform(
        ({ obj }: { obj: FormData }) => obj.getAll('aliases').map(FormDataDTO.emptyToUndefined),
        TO_CLASS_ONLY
      )
      public readonly aliases?: string[];

      @Expose()
      @MinLength(2, { each: true })
      @MaxLength(64, { each: true })
      @ValidateIf(({ obj }) => obj?.contexts)
      @Transform(
        ({ obj }: { obj: FormData }) => obj.getAll('contexts').map(FormDataDTO.emptyToUndefined),
        TO_CLASS_ONLY
      )
      public readonly contexts?: string[];

      @Expose()
      @MaxLength(1024, { each: true })
      @ValidateIf(({ obj }) => obj?.texts)
      @Transform(
        ({ obj }: { obj: FormData }) => obj.getAll('texts').map(FormDataDTO.emptyToUndefined),
        TO_CLASS_ONLY
      )
      public readonly texts?: string[];
    }

    const formData = plainToInstance(
      FormDataDTO,
      await event.request.formData(),
      CLASS_TRANSFORMER_OPTIONS
    );
    const formDataErrors = validateSync(formData, CLASS_VALIDATOR_OPTIONS);

    if (formDataErrors.length !== 0 || event.locals.user == null) {
      return fail(422, { errors: formDataErrors.toString() });
    }

    const [createdBy, updatedBy] = [event.locals.user, event.locals.user];
    const byFields = { createdBy, updatedBy };
    const onConflictExcludeFields = ['id', 'createdBy', 'createdAt'];

    await event.locals.db.em.transactional(async (em) => {
      const term = wrap(new Term({ orgId: 'wxsd.us', letters: formData.letters })).assign(byFields);
      await em.upsert(Term, term, {
        onConflictFields: ['orgId', 'letters'],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onConflictExcludeFields
      });

      const aliases = (formData.aliases ?? []).map((r) =>
        wrap(new Alias({ term, letters: r, priority: 0 })).assign(byFields)
      );
      const explanations = Object.entries(
        Object.fromEntries((formData.contexts ?? []).map((k, i) => [k, formData.texts?.[i]]))
      ).map((r) => wrap(new Explanation({ term, context: r[0], text: r[1] })).assign(byFields));

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
