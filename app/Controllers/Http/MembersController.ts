import Drive from '@ioc:Adonis/Core/Drive'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Member from 'App/Models/Member'
import { genIdSize } from 'cf-gen-id'

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

    await member!.save()

    return true
  }

  public async updateProfile(ctx: HttpContextContract) {
    const profile = ctx.request.file('profile', {
      size: '107mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (profile && profile.isValid) {
      if (ctx.auth.user!.profile) {
        const pathToImg = ctx.auth.user!.profile.split('/uploads/')[1]

        await Drive.delete(pathToImg)
      }

      const filePath = './' + genIdSize(20) + '.' + profile.extname

      await profile.moveToDisk('./', {
        name: filePath,
      })

      const urlToNewFile = await Drive.getUrl(filePath)
      const member = await Member.find(ctx.auth.user!.id)
      member!.profile = urlToNewFile
      await member!.save()
      return true
    } else {
      return false
    }
  }
}
