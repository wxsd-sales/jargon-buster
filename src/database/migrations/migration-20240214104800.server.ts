import { Migration } from '@mikro-orm/migrations';

export class Migration20240214104800 extends Migration {
  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql(
      'CREATE TABLE `_knex_temp_alter203` (`id` text NOT NULL, `created_at` datetime NOT NULL DEFAULT current_timestamp, `updated_at` datetime NOT NULL DEFAULT current_timestamp, `term_id` text NOT NULL, `text` text, `context` text NOT NULL, `created_by_id` text NOT NULL, `updated_by_id` text NOT NULL, CONSTRAINT `explanation_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `term` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `explanation_created_by_id_foreign` FOREIGN KEY (`created_by_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE, CONSTRAINT `explanation_updated_by_id_foreign` FOREIGN KEY (`updated_by_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE, PRIMARY KEY (`id`));'
    );
    this.addSql('INSERT INTO "_knex_temp_alter203" SELECT * FROM "explanation";;');
    this.addSql('DROP TABLE "explanation";');
    this.addSql('ALTER TABLE "_knex_temp_alter203" RENAME TO "explanation";');
    this.addSql('CREATE INDEX `explanation_term_id_index` on `explanation` (`term_id`);');
    this.addSql(
      'CREATE INDEX `explanation_created_by_id_index` on `explanation` (`created_by_id`);'
    );
    this.addSql(
      'CREATE INDEX `explanation_updated_by_id_index` on `explanation` (`updated_by_id`);'
    );
    this.addSql('PRAGMA foreign_keys = ON;');

    this.addSql(
      'create unique index `alias_term_id_letters_unique` on `alias` (`term_id`, `letters`);'
    );
  }
}
