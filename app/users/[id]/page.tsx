import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublicUserProfilePage({
  params,
}: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      projects: true,
      memberships: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
          <h1 className="text-5xl font-black">
            {user.name || "Anonymous User"}
          </h1>

          <p className="mt-3 text-zinc-400">
            {user.email}
          </p>

          <p className="mt-6 max-w-3xl text-zinc-300">
            {user.bio || "No bio added yet."}
          </p>

          {user.skills && (
            <p className="mt-4 text-cyan-300">
              Skills: {user.skills}
            </p>
          )}

          <div className="mt-6 flex gap-4">
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                className="text-violet-400 hover:underline"
              >
                GitHub
              </a>
            )}

            {user.linkedinUrl && (
              <a
                href={user.linkedinUrl}
                target="_blank"
                className="text-cyan-400 hover:underline"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {user.projects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-bold">
                {project.title}
              </h2>

              <p className="mt-3 text-zinc-400">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}