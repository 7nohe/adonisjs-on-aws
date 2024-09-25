import { Head, Link, useForm } from "@inertiajs/react";

export default function Create() {
  const { data, post, setData } = useForm({
    title: '',
    content: ''
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/posts')
  }
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
      <Head title="Create Post" />
      <Link href="/posts" style={{
        marginBottom: '20px',
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: 'white',
        borderRadius: '5px',
        textDecoration: 'none'
      }}>Back</Link>
      <form method="post" onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <input type="text" name="title" placeholder="Title" value={data.title} style={{
          marginBottom: '10px'
        }}
          onChange={(e) => {
            setData('title', e.target.value)
          }}
        />
        <textarea name="content" placeholder="Content" value={data.content} style={{
          marginBottom: '10px'
        }} onChange={(e) => {
          setData('content', e.target.value)
        }}></textarea>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          border: 'none'
        }} type="submit">Create Post</button>
      </form>
    </div>
  )

}
