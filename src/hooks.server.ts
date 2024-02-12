import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { databaseConnection } from '$lib/server/handlers/database-connection';
import { authentication } from '$lib/server/handlers/authentication';
import { authorization } from '$lib/server/handlers/authorization';

const handlers = [databaseConnection, authentication, authorization];

export const handle: Handle = sequence(...handlers);
