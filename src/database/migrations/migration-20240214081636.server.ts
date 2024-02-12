import { Migration } from '@mikro-orm/migrations';

export class Migration20240214081636 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `term` (`id` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `org_id` text not null, `letters` text not null, `created_by_id` text not null, `updated_by_id` text not null, constraint `term_created_by_id_foreign` foreign key(`created_by_id`) references `user`(`id`) on update cascade, constraint `term_updated_by_id_foreign` foreign key(`updated_by_id`) references `user`(`id`) on update cascade, primary key (`id`));'
    );
    this.addSql('create index `term_org_id_index` on `term` (`org_id`);');
    this.addSql('create index `term_letters_index` on `term` (`letters`);');
    this.addSql('create index `term_created_by_id_index` on `term` (`created_by_id`);');
    this.addSql('create index `term_updated_by_id_index` on `term` (`updated_by_id`);');
    this.addSql(
      'create unique index `term_org_id_letters_unique` on `term` (`org_id`, `letters`);'
    );

    this.addSql(
      'create table `explanation` (`id` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `term_id` text not null, `text` text not null, `context` text not null, `created_by_id` text not null, `updated_by_id` text not null, constraint `explanation_term_id_foreign` foreign key(`term_id`) references `term`(`id`) on delete cascade on update cascade, constraint `explanation_created_by_id_foreign` foreign key(`created_by_id`) references `user`(`id`) on update cascade, constraint `explanation_updated_by_id_foreign` foreign key(`updated_by_id`) references `user`(`id`) on update cascade, primary key (`id`));'
    );
    this.addSql('create index `explanation_term_id_index` on `explanation` (`term_id`);');
    this.addSql(
      'create index `explanation_created_by_id_index` on `explanation` (`created_by_id`);'
    );
    this.addSql(
      'create index `explanation_updated_by_id_index` on `explanation` (`updated_by_id`);'
    );

    this.addSql(
      'create table `alias` (`id` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `term_id` text not null, `letters` text not null, `priority` integer not null, `created_by_id` text not null, `updated_by_id` text not null, constraint `alias_term_id_foreign` foreign key(`term_id`) references `term`(`id`) on delete cascade on update cascade, constraint `alias_created_by_id_foreign` foreign key(`created_by_id`) references `user`(`id`) on update cascade, constraint `alias_updated_by_id_foreign` foreign key(`updated_by_id`) references `user`(`id`) on update cascade, primary key (`id`));'
    );
    this.addSql('create index `alias_term_id_index` on `alias` (`term_id`);');
    this.addSql('create index `alias_created_by_id_index` on `alias` (`created_by_id`);');
    this.addSql('create index `alias_updated_by_id_index` on `alias` (`updated_by_id`);');
  }
}
