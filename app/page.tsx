import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-5xl">

          <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-[#111113]/80 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
            🚀 Collaborative Academic Development Platform
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl">
            Build{" "}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Collaborate
            </span>{" "}
            Innovate
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            CampusHub helps students create projects, manage contributors,
            share resources, and collaborate in one focused academic workspace.
          </p>


          <div className="mx-auto mt-10 grid max-w-3xl gap-3 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-[#111113]/80 p-4 backdrop-blur">
              <p className="text-sm text-zinc-500">
                Project Repositories
              </p>

              <p className="mt-2 text-lg font-bold">
                Build & Showcase
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111113]/80 p-4 backdrop-blur">
              <p className="text-sm text-zinc-500">
                Team Collaboration
              </p>

              <p className="mt-2 text-lg font-bold">
                Join & Contribute
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111113]/80 p-4 backdrop-blur">
              <p className="text-sm text-zinc-500">
                Shared Resources
              </p>

              <p className="mt-2 text-lg font-bold">
                Files & Discussions
              </p>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}