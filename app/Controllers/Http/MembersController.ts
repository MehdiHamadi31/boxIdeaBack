import Member from 'App/Models/Member'

export default class MembersController {
  public async all() {
    /*  try {
      avant de renvoyer la liste des membres il nous faut verifier que l user est authentifier
      await ctx.auth.authenticate()
    } catch (error) {
      return {
        login: false,
        error: true,
      }
    } Ce try catch devra etre fait pour tous nos controllers a la place de repeter ce code
    nous allons utiliser un middleware (qui est quelque chose qui s exectute entre la route et le controller 
     la route est appelé, le middleware s 'execute et si c 'est ok le controller est appelé sinon il renverra une erreur au front).

     Member.all() nous retourne tous les membres en suivant notre model Member tous ce qui n est pas ds notre model
    ne sera pas retourné!*/


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
