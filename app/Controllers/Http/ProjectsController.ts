import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Project from 'App/Models/Project'

export default class ProjectsController {
  public async create(ctx: HttpContextContract) {
    try {
      const { title, description } = ctx.request.body() // on recup le titre et la description dans le body de la requete
      const memberId = ctx.auth.user!.id // auth recup tout ce qui concerne l authentification, tout ce qui concerne lutilisateur sera ds
      // user et on veut l id.

      const project = new Project() // on stock un new projet dans const projet
      project.title = title // le title associé au projet sera le title
      project.description = description //la description associé au project sera la description
      project.memberId = memberId //on recup l id du membre pr savoir a qui appartient le projet

      await project.save() // va nous sauvegarder le projet crée
      return true // si tout se passe bien il nous retourne true sinon il va dans le catch et nous retourne false
    } catch (error) {
      return false
    }
  }
  public async all(ctx: HttpContextContract) {
    const memberId = ctx.auth.user!.id //on recupere l id de la personne connectée qui va faire la requete,
    // user! signifie que l on est sur que l user existe car ici le middleware a deja fait son travail de rejeter la requete
    // si l user n est pas authentifié!
    const projects = await Project.query().preload('member').preload('votes') //on prend toutes les infos sur le membre qui crée le projet (1 seul createur par projet et tous les votes recu par ce projet)
    const projectsSerialised = projects.map((project) => {
      // on va parcourir le tableau projects qui contient un model de projet a chq ligne
      // et on va le retourner de facon serialisé ( cad : de facon a ce qu il contienne un objet nettoyé de ttes les fonctions du model )
      //ce qui va nous permettre d avoir un projet modifiable car sans ca le model n est pas modifiable .
      return project.serialize()
    })
    const projectsFinalPromises = projectsSerialised.map(async (project) => {
      // on fait un second map sur chaque projet afin de verifier si les lignes du tableau
      // contiennent mon iD et l'iD du projet) , un tab sera retourné.
      const projectVoted = await Database.from('votes')
        .where('member_id', memberId)
        .andWhere('project_id', project.id)

      //si la longueur de tableau est sup a 0 ca signifie que j ai deja voté
      const isAlreadyVoted = projectVoted.length > 0

      //on ajoute une propriété a un projet qui sera = a un booléen
      project.isAlreadyVoted = isAlreadyVoted

      //on ajoute l'attribut owner a projet et on va verifier si l 'id de la personne qui est connecté est le meme que l'id du createur!
      project.owner = project.member_id === ctx.auth.user!.id
      project.totalVotes = project.votes.length

      return project
    })

    //on stock dans projetFinal la resolution de toutes les promesses et on  retourneras au front le resultat de ces promesses!
    const projectFinal = await Promise.all(projectsFinalPromises)
    return projectFinal
  }
  //

  //FONCTION DELETE
  public async delete(ctx: HttpContextContract) {
    try {
      const { projectId } = ctx.request.body()
      const project = await Project.findOrFail(projectId)
      await project.delete()
      return true
    } catch (error) {
      return false
    }
  }
}
