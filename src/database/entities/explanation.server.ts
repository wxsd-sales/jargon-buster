import { Entity, ManyToOne, Property, types, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.server';
import { Term } from './term.server';
import { User } from './user.server';
import type { Rel } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['term', 'context'] })
export class Explanation extends BaseEntity {
  @ManyToOne({ entity: () => Term, onDelete: 'cascade' })
  term!: Rel<Term>;

  @Property({ type: types.string })
  context!: string;

  @Property({ type: types.string, nullable: true })
  text?: string;

  @ManyToOne({ entity: () => User, hidden: true })
  createdBy!: Rel<User>;

  @ManyToOne({ entity: () => User, hidden: true })
  updatedBy!: Rel<User>;

  constructor(obj: { term: Term; context: string; text?: string }) {
    super();
    this.term = obj.term;
    this.context = obj.context;
    this.text = obj.text;
  }
}
