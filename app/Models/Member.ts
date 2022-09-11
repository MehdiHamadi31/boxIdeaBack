import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import Vote from './Vote'

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public mail: string

  @column()
  public password: string

  @hasMany(() => Vote)
  public votes: HasMany<typeof Vote>

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>
}
