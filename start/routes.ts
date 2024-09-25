/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const PostsController = () => import('#controllers/posts_controller')

router.on('/').redirect('posts.index').as('home')
router.group(() => {
  router.get('/', [PostsController, 'index']).as('index')
  router.get('/create', [PostsController, 'create']).as('create')
  router.post('/', [PostsController, 'store']).as('store')
  router.delete('/:id', [PostsController, 'destroy']).as('destroy')
}).prefix('posts').as('posts')
