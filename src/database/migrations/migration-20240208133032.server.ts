import { Migration } from '@mikro-orm/migrations';

export class Migration20240208133032 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `data` (`id` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `bits` blob not null, `name` text not null, `type` text not null, `last_modified` datetime not null, primary key (`id`));'
    );

    this.addSql(
      'create table `user` (`id` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `name` text null, `email` text not null, `email_verified` datetime null, `image` text null, primary key (`id`));'
    );
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');

    this.addSql(
      'create table `session` (`id` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `user_id` text not null, `expires` datetime not null, `session_token` text not null, constraint `session_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on delete cascade on update cascade, primary key (`id`));'
    );
    this.addSql('create index `session_user_id_index` on `session` (`user_id`);');
    this.addSql(
      'create unique index `session_session_token_unique` on `session` (`session_token`);'
    );

    this.addSql(
      'create table `account` (`id` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `user_id` text not null, `type` text not null, `provider` text not null, `provider_account_id` text not null, `refresh_token` text null, `access_token` text null, `expires_at` integer null, `token_type` text null, `scope` text null, `id_token` text null, `session_state` text null, constraint `account_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on delete cascade on update cascade, primary key (`id`));'
    );
    this.addSql('create index `account_user_id_index` on `account` (`user_id`);');
    this.addSql(
      'create unique index `account_provider_provider_account_id_unique` on `account` (`provider`, `provider_account_id`);'
    );
  }
}
