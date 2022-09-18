import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vote from 'App/Models/Vote'

export default class VotesController {
    public async vote(ctx: HttpContextContract){
        
        try {
            const { projectId } = ctx.request.body()
            const memberId = ctx.auth.user!.id // auth recup tout ce qui concerne l authentification,
            // tout ce qui concerne lutilisateur sera ds user et on veut l id.
      
            const vote = new Vote()
            vote.projectId = projectId
            vote.memberId = memberId
      
            await vote.save() // va nous sauvegarder le vote
            return true
          } catch (error) {
            return false
          }
    }
}
