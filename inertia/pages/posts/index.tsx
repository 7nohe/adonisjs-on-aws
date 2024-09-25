import { Head, Link, router } from '@inertiajs/react'

export default function Index(props: { posts: { id: string, title: string, content: string }[] }) {
  const { posts } = props

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '20px',
    }}>
      <Head title="Posts" />
      <h1 style={{
        marginBottom: '20px',
        fontSize: '24px'
      }}>Posts</h1>
      <Link href="/posts/create" style={{
        marginBottom: '20px',
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: 'white',
        borderRadius: '5px',
        textDecoration: 'none'
      }}>Create Post</Link>
      <ul>{
        posts.map((post) => (
          <li key={post.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            gap: '10px'
          }}>
            <p>{post.title}: {post.content}</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: 'red',
              width: '100px',
              height: '40px',
              color: 'white',
              borderRadius: '5px',
              marginRight: '10px',
              fontSize: '16px'
            }} onClick={() => {
              router.delete(`/posts/${post.id}`)
            }}>Delete</button>
          </li>
        ))
      }</ul>
    </div>
  )
}
