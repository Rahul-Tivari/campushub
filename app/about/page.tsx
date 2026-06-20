export default function AboutPage() {
  return (

    <main className="min-h-screen bg-black text-white px-8 py-16">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          About CampusHub
        </h1>

        <p className="text-zinc-400 text-lg leading-8 mb-10">
          CampusHub is a GitHub-inspired academic collaboration
          platform designed for students, developers, and institutions
          to collaborate on projects, share resources, manage contributors,
          discuss ideas, and build innovative solutions together.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              Core Features
            </h2>

            <ul className="space-y-3 text-zinc-300">

              <li>
                • Project Repository Management
              </li>

              <li>
                • Team Collaboration System
              </li>

              <li>
                • Contributor Approval Workflow
              </li>

              <li>
                • Project Discussions
              </li>

              <li>
                • Cloud File Uploads
              </li>

              <li>
                • Shared Project Resources
              </li>

            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Technologies Used
            </h2>

            <ul className="space-y-3 text-zinc-300">

              <li>
                • Next.js 16
              </li>

              <li>
                • React
              </li>

              <li>
                • Tailwind CSS
              </li>

              <li>
                • Prisma ORM
              </li>

              <li>
                • PostgreSQL
              </li>

              <li>
                • Supabase Storage
              </li>

              <li>
                • NextAuth.js
              </li>

            </ul>

          </div>

        </div>

        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          <h2 className="text-3xl font-bold mb-4">
            Vision
          </h2>

          <p className="text-zinc-400 leading-8">
            CampusHub aims to bridge the gap between academic learning
            and real-world software collaboration by providing a centralized
            platform where students can build, contribute, learn, and
            showcase projects in a professional collaborative environment.
          </p>

        </div>

      </div>

    </main>
  );
}