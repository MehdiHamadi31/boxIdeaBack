import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Project from 'App/Models/Project'

export default class ProjectsController {
  public async create(ctx: HttpContextContract) {
    try {
      const { title, description } = ctx.request.body()
      const memberId = ctx.auth.user!.id // auth recup tout ce qui concerne l authentification, tout ce qui concerne lutilisateur sera ds
      // user et on veut l id.

      const project = new Project()
      project.title = title
      project.description = description
      project.memberId = memberId

      await project.save() // va nous sauvegarder le projet crée
      return true
    } catch (error) {
      return false
    }
  }
  public async all(ctx: HttpContextContract){
    const memberId = ctx.auth.user!.id //on recupere l id de la personne connectée qui va faire la requete 
    const projects = await Project.query().preload('member') //on prend tous le membre qui crée le projet (1 seul createur par projet)
    const projectsSerialised = projects.map((project) => {
        return project.serialize()
    })
    const projectsFinalPromises = projectsSerialised.map(async (project) =>{
        const projectVoted = await Database.from('votes').where('member_id',memberId).andWhere('project_id',project.id)
        const isAlreadyVoted = projectVoted.length > 0
        project.isAlreadyVoted = isAlreadyVoted
        return project
            })
    const projectFinal = await Promise.all(projectsFinalPromises)    
    return projectFinal    
  }
}
