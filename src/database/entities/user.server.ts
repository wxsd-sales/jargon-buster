import type { AdapterUser } from '@auth/core/adapters';
import { Cascade, Collection, Entity, OneToMany, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.server';
import { Session } from './session.server';
import { Account } from './account.server';

@Entity()
export class User extends BaseEntity implements AdapterUser {
  public static readonly ADMIN_EMAIL_REGEX: RegExp = /.+@wxsd\.us$/;

  @Property({ type: types.string, nullable: true })
  name?: string;

  @Property({ type: types.string, unique: true })
  email!: string;

  @Property({ type: types.datetime, nullable: true })
  emailVerified: Date | null = null;

  @Property({ type: types.string, nullable: true })
  image?: string;

  @OneToMany({
    entity: () => Session,
    mappedBy: (session) => session.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL]
  })
  sessions: Collection<Session> = new Collection<Session>(this);

  @OneToMany({
    entity: () => Account,
    mappedBy: (account) => account.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL]
  })
  accounts: Collection<Account> = new Collection<Account>(this);

  constructor() {
    super();
  }

  public isAdmin() {
    return this.email.match(User.ADMIN_EMAIL_REGEX) ?? false;
  }
}
