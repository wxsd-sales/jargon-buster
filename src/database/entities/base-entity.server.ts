import 'reflect-metadata';
import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey({ type: types.uuid })
  id: string = crypto.randomUUID();

  @Property({ type: types.datetime, onCreate: () => new Date(), defaultRaw: 'current_timestamp' })
  createdAt!: Date;

  @Property({ type: types.datetime, onUpdate: () => new Date(), defaultRaw: 'current_timestamp' })
  updatedAt: Date = new Date();

  protected constructor(id: string = crypto.randomUUID()) {
    this.id = id;
  }
}
