import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Member from 'App/Models/Member'

export default class MembersController {
  public async all(ctx: HttpContextContract) {
    const members = await Member.query().preload('voted') //
    const membersSerialized = members.map((member) => {
      return member.serialize()
    })
    const membersFinal = membersSerialized.map((member) => {
      member.voted = member.voted.length
      member.owner = member.id === ctx.auth.user!.id
      return member
    })
    return membersFinal
  }
  public async update(ctx: HttpContextContract) {
    
    const { firstname, lastname, mail } = ctx.request.body()

    const member = await Member.find(ctx.auth.user!.id)
    if (firstname) {
      member!.firstname = firstname
    } else if (lastname) {
      member!.lastname = lastname
    } else if (mail) {
      member!.mail = mail
    }

    // const profile = ctx.request.file('profile', {
    //   size: '2mb',
    //   extnames: ['jpg', 'png'],
    // })

    // if (profile && profile.isValid) {
    //   await profile.moveToDisk('/profiles')
    // } else {
    //   throw new Error('bad file')
    // }
    await member!.save()
    
    
    return false
  }
}
