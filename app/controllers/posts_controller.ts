import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  public async index({ inertia }: HttpContext) {
    const posts = await Post.all()
    return inertia.render('posts/index', { posts })
  }

  public async create({ inertia }: HttpContext) {
    return inertia.render('posts/create')
  }

  public async store({ request, response }: HttpContext) {
    const { title, content } = request.all()
    await Post.create({ title, content })
    return response.redirect().toRoute('posts.index')
  }

  public async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.redirect().toRoute('posts.index')
  }
}
