// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { User } from '$database/entities';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: import('@mikro-orm/core').MikroORM;
      user?: User;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
