import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Member from 'App/Models/Member'
import Hash from '@ioc:Adonis/Core/Hash'

export default class ConnexionsController {
  public async register(ctx: HttpContextContract) {
    console.log('je suis ici0')
    //async permet d'utiliser utiliser await pour faire des taches en fond
    try {
      const { firstname, lastname, mail, password } = ctx.request.body()

      const member = new Member()
      member.firstname = firstname
      member.lastname = lastname
      member.mail = mail
      member.password = await Hash.make(password) //va hacher le mdp

      const profile = ctx.request.file('profile', {
        size: '2mb',
        extnames: ['jpg', 'png'],
      })
      console.log('je suis ici1')
      if (profile && profile.isValid) {
        console.log('je suis ici3')

        await profile.moveToDisk('/profiles')
        console.log('je suis ici2')
      } else {
        throw new Error('bad file')
      }
      await member.save() // va nous sauvegarder le membre crée

      // auth.attempt va verifier dans la bdd si l user existe avec le mot de pass associé et si c 'est
      // ok il crée une session (et lui attribut des cookies), il est connecté d office
      const { token } = await ctx.auth.attempt(mail, password)

      return {
        login: true,
        error: false,
        token,
      }
    } catch (error) {
      console.log(error);
      
      return {
        login: false,
        error: true,
      }
    }
  }

  public async login(
    ctx: HttpContextContract // on prend le ctx de la requete qui est de type HttpContextContract
  ) {
    try {
      // on cree une const mail dans laquelle sera stockée le mail present dans le body de la requete du contexte.
      const mail = ctx.request.body().mail

      // on cree une const password dans laquelle sera stockée le password present dans le body de la requete du contexte.
      const password = ctx.request.body().password

      // auth.attempt va verifier dans la bdd si l user existe avec le mot de pass associé et si c 'est
      // ok il crée une session (et lui attribut un token), il est connecté d office
      const { token } = await ctx.auth.attempt(mail, password)

      return {
        login: true,
        error: false,
        token,
      }
    } catch (error) {
      return {
        login: false,
        error: true,
      }
    }
  }

  public async logout(ctx: HttpContextContract) {
    /* on prend le context de type httpContext
  on essait d'utiliser la fct logout qui appartient a la classe auth qui appartient elle meme
  au context si celle ci fonctionne elle nous retourne login false et error false,par contre si elle echoue
  on passe dans le catch et elle nous retourne login true et error true ==> càd que la personne reste connectée
  et nous recevons un msg d 'erreur */
    try {
      await ctx.auth.logout()
      return {
        login: false,
        error: false,
      }
    } catch (error) {
      return {
        login: true,
        error: true,
      }
    }
  }
}
