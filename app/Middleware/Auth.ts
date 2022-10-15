import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

/*
L'intergiciel d'authentification est destiné à restreindre l'accès non authentifié à une route donnée ou à un groupe de routes.
 
 
 Vous devez enregistrer ce middleware dans le fichier `start/kernel.ts` sous la liste
 des middleware nommés.*/
export default class AuthMiddleware {
  /**
   * Handle request
   */
  public async handle(ctx: HttpContextContract, next) {
    // if (Env.get('NODE_ENV') === 'development'){
    //  await next()
    //  return 
    
    // }
    try {
      //avant de renvoyer la liste des membres il nous faut verifier que l user est authentifier
      await ctx.auth.authenticate()// authenticate() verifie les cookies afin de savoir si on est bien authentifié ou pas
      await next() //Si on est authentifié next()permet de passer a la suite ,un autre middleware ou alors le controller
    } catch (error) {
      return ctx.response.send({
        login: false,
        error: true,
      })
    }
  }
}
