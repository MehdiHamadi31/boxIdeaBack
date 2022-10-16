import Member from 'App/Models/Member'

export default class MembersController {
  public async all() {
    const members = await Member.query().preload('voted') //
    const membersSerialized = members.map((member) => {
      return member.serialize()
    })
    const membersFinal = membersSerialized.map((member) => {
      member.voted = member.voted.length
      return member
    })
    return membersFinal
  }
}
