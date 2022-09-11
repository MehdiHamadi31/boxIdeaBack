import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Member from 'App/Models/Member'
import Hash from '@ioc:Adonis/Core/Hash'

export default class ConnexionsController {
  public async register(ctx: HttpContextContract) {
    try {
      const { firstname, lastname, mail, password } = ctx.request.body()

      const member = new Member()
      member.firstname = firstname
      member.lastname = lastname
      member.mail = mail
      member.password = await Hash.make(password)
      await member.save()

      await ctx.auth.use('web').attempt(mail, password)

      return {
        login: true,
        error: false,
      }
    } catch (error) {
      return {
        login: false,
        error: true,
      }
    }
  }

  public async login({ request, auth }: HttpContextContract) {
    return 'login'
  }
}
