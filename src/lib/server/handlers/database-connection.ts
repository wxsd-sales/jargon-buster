import type { Handle } from '@sveltejs/kit';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import config from '../../../../mikro-orm.config';
import * as entities from '$database/entities';

const orm = await MikroORM.init({ ...config, entities: Object.values(entities) });

export const databaseConnection: Handle = async ({ event, resolve }) => {
  return await RequestContext.createAsync(orm.em, async () => {
    event.locals.db = orm;

    return resolve(event);
  });
};
