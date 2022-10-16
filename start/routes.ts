/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// la route register fera appel au controller de connexion
Route.get('/',()=>'le back de boxidea') 
Route.post('/register', 'ConnexionsController.register')
Route.post('/', 'ConnexionsController.login')

Route.group(()=>{// on groupe les routes qui auront besoin d 'utiliser le middleware
    // le middleware nous permet de ne pas recopier le code dans chaque controller
    //on l appel par le nom que lon lui a donné dans le fichier kernel.ts
    Route.get('/logout', 'ConnexionsController.logout')
    Route.get('/members/all', 'MembersController.all')
    Route.get('/projects/all', 'ProjectsController.all')
    Route.post('/projects/create', 'ProjectsController.create')
    Route.post('/vote', 'VotesController.vote')
    
   


}).middleware('auth')



