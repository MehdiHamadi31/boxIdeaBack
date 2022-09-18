import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Member from './Member'
import Project from './Project'

export default class Vote extends BaseModel {
  @column()
  public memberId: number

  @column()
  public projectId: number

  @belongsTo(() => Member)
  public member: BelongsTo<typeof Member>

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>
}
