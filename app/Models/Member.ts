import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
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

  @column({ serializeAs: null }) // le fait de mettre nul va permettre que le mot de passe ne soit pas renvoyé
  public password: string

  @column()
  public profile: string

  // ici on recup la liste des projets pour lequel il a voté
  @hasMany(() => Vote)
  public votes: HasMany<typeof Vote>

  // ici on recup la liste de ses projets
  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  // ici on recupere la liste des votes recu par le membre pour l ensemble de ses projets
  @hasManyThrough([() => Vote, () => Project])
  public voted: HasManyThrough<typeof Vote>
}
