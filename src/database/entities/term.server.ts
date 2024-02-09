import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  types,
  Unique
} from '@mikro-orm/core';
import { BaseEntity } from './base-entity.server';
import { Alias } from './alias.server';
import { Explanation } from './explanation.server';
import { User } from './user.server';
import type { Rel } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['orgId', 'letters'] })
export class Term extends BaseEntity {
  @Property({ type: types.uuid, nullable: false, index: true })
  orgId!: string;

  @Property({ type: types.string, nullable: false, index: true })
  letters!: string;

  @OneToMany({
    entity: () => Alias,
    mappedBy: (alias) => alias.term,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL]
  })
  aliases: Collection<Alias> = new Collection<Alias>(this);

  @OneToMany({
    entity: () => Explanation,
    mappedBy: (explanation) => explanation.term,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL]
  })
  explanations: Collection<Explanation> = new Collection<Explanation>(this);

  @ManyToOne({ entity: () => User })
  createdBy!: Rel<User>;

  @ManyToOne({ entity: () => User })
  updatedBy!: Rel<User>;

  constructor(obj: { orgId: string; letters: string }) {
    super();
    this.orgId = obj.orgId;
    this.letters = obj.letters;
  }
}
