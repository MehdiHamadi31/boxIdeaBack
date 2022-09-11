import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('member_id').references('id').inTable('members').unsigned().onDelete('CASCADE')
      table.string('title', 255).notNullable()
      table.text('description', 'longtext').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
