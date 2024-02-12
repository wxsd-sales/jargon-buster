import { Migration } from '@mikro-orm/migrations';

export class Migration20240214112408 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create unique index `explanation_term_id_context_unique` on `explanation` (`term_id`, `context`);'
    );
  }
}
