import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vote from 'App/Models/Vote'

export default class VotesController {
    public async vote(ctx: HttpContextContract){
        
        try {
            const { projectId } = ctx.request.body()
            const memberId = ctx.auth.user!.id // auth recup tout ce qui concerne l authentification,
            // tout ce qui concerne lutilisateur sera ds user et on veut l id.
      
            const vote = new Vote() // on cree un nvx vote 
            vote.projectId = projectId //on stock l' id du projet que l on recupere  dans le body de la requete
            vote.memberId = memberId //on stock l' id du membre que l on recupere  dans le body de la requete
      
            await vote.save() // va nous sauvegarder le vote
            return true // si tout se passe bien il nous retourne true et si il y a une erreur on passe dans le catch et il nous retourne alors false
          } catch (error) {
            return false
          }
    }
}
