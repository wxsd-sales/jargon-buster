import 'reflect-metadata';
import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.server';
import { User } from './user.server';
import type { AdapterSession } from '@auth/core/adapters';
import type { Rel } from '@mikro-orm/core';

@Entity()
export class Session extends BaseEntity implements AdapterSession {
  @ManyToOne({ entity: () => User, hidden: true, onDelete: 'cascade' })
  user!: Rel<User>;

  @Property({ type: types.string, persist: false })
  userId!: string;

  @Property({ type: types.date })
  expires!: Date;

  @Property({ type: types.string, unique: true })
  sessionToken!: string;

  constructor() {
    super();
  }
}
