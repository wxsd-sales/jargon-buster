import { defineConfig } from '@mikro-orm/better-sqlite';
import { Migrator } from '@mikro-orm/migrations';
import { LoadStrategy, ReflectMetadataProvider } from '@mikro-orm/core';

const config = defineConfig({
  metadataProvider: ReflectMetadataProvider,
  forceUndefined: true,
  dbName: '.data/app.sqlite3',
  entities: ['./src/database/entities'],
  debug: false,
  loadStrategy: LoadStrategy.JOINED,
  extensions: [Migrator],
  migrations: {
    fileName: (timestamp) => `migration-${timestamp}.server`,
    tableName: 'migrations',
    path: './src/database/migrations'
  }
});

export default config;
