import { Entity, ManyToOne, Property, types, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.server';
import { Term } from './term.server';
import { User } from './user.server';
import type { Rel } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['term', 'letters'] })
export class Alias extends BaseEntity {
  @ManyToOne({ entity: () => Term, onDelete: 'cascade' })
  term!: Rel<Term>;

  @Property({ type: types.string })
  letters!: string;

  @Property({ type: types.integer })
  priority!: number;

  @ManyToOne({ entity: () => User, hidden: true })
  createdBy!: Rel<User>;

  @ManyToOne({ entity: () => User, hidden: true })
  updatedBy!: Rel<User>;

  constructor(obj: { term: Term; letters: string; priority: number }) {
    super();
    this.term = obj.term;
    this.letters = obj.letters;
    this.priority = obj.priority;
  }
}
