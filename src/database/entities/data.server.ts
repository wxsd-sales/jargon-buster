import { Entity, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.server';

@Entity()
export class Data extends BaseEntity {
  @Property({ type: types.blob })
  bits!: Buffer | string;

  @Property({ type: types.string })
  name!: string;

  @Property({ type: types.string })
  type!: string;

  @Property({ type: types.datetime })
  lastModified!: Date;

  constructor(obj: { bits: Buffer | string; name: string; type: string; lastModified: Date }) {
    super();
    this.bits = obj.bits;
    this.name = obj.name;
    this.type = obj.type;
    this.lastModified = obj.lastModified;
  }

  public toUri() {
    return 'data:' + this.type + ';base64,' + this.bits.toString('base64');
  }
}
