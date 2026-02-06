import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Xiro The Dev
      </h1>
      <p className="mb-4">
        {`Hello! I'm a Full Stack Developer specializing in Next.js and NestJS, 
        passionate about building valuable LLM-integrated projects for the community. 
        I'm currently focused on creating innovative solutions that leverage AI to solve 
        real-world problems and deliver meaningful impact.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
