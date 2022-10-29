import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  

  public async up () {
    this.schema.alterTable('members', (table) => {
      table.string('profile', 255).nullable()
    })
  }

  public async down () {
    this.schema.table('members', (table)=>{
        table.dropColumn('profile')
    })
  }
}
