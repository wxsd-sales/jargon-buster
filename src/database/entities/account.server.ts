import { BaseEntity } from './base-entity.server';
import { Entity, ManyToOne, Property, types, Unique } from '@mikro-orm/core';
import { User } from './user.server';
import type { AdapterAccount } from '@auth/core/adapters';
import type { Rel } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['provider', 'providerAccountId'] })
export class Account extends BaseEntity implements AdapterAccount {
  @ManyToOne({ entity: () => User, hidden: true, onDelete: 'cascade' })
  user!: Rel<User>;

  @Property({ type: types.string, persist: false })
  userId!: string;

  @Property({ type: types.string })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  type!: string;

  @Property({ type: types.string })
  provider!: string;

  @Property({ type: types.string })
  providerAccountId!: string;

  @Property({ type: types.string, nullable: true })
  refresh_token?: string;

  @Property({ type: types.string, nullable: true })
  access_token?: string;

  @Property({ type: types.integer, nullable: true })
  expires_at?: number;

  @Property({ type: types.string, nullable: true })
  token_type?: Lowercase<string>;

  @Property({ type: types.string, nullable: true })
  scope?: string;

  @Property({ type: types.text, nullable: true })
  id_token?: string;

  @Property({ type: types.string, nullable: true })
  session_state?: string;

  constructor() {
    super();
  }
}
