import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EditProfileForm from "@/components/EditProfileForm";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  Sparkles,
  Code2,
  LinkIcon,
} from "lucide-react";

export default async function ProfilePage() {
  const session =
    await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email:
          session.user.email,
      },
      include: {
        projects: {
          orderBy: {
            createdAt: "desc",
          },
        },
        memberships: {
          include: {
            project: true,
          },
        },
      },
    });

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.name || "Anonymous User";

  const initials =
    (user.name || user.email)
      .charAt(0)
      .toUpperCase();

  const totalContributions =
    user.projects.length +
    user.memberships.length;

  return (
    <main className="min-h-screen bg-[#09090B] px-6 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111113] p-8 shadow-2xl shadow-black/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08),transparent_35%)]" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="avatar"
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-3xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-violet-600 text-5xl font-black shadow-lg shadow-violet-600/30">
                  {initials}
                </div>
              )}

              <div>
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
                  Student Profile
                </p>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  {displayName}
                </h1>

                <p className="mt-3 text-zinc-400">
                  {user.email}
                </p>

                <p className="mt-5 max-w-2xl leading-7 text-zinc-300">
                  {user.bio ||
                    "No bio added yet. Add a short bio to tell collaborators what you build and what you are interested in."}
                </p>

                {user.skills && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {user.skills
                      .split(",")
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-300"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:flex-col">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06]"
                >
                  <Code2 className="h-4 w-4" />
                  GitHub
                </a>
              )}

              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06]"
                >
                  <LinkIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#111113] p-6">
            <FolderKanban className="mb-5 h-6 w-6 text-violet-400" />

            <p className="text-sm text-zinc-500">
              Projects Created
            </p>

            <p className="mt-2 text-4xl font-black">
              {user.projects.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111113] p-6">
            <Users className="mb-5 h-6 w-6 text-cyan-400" />

            <p className="text-sm text-zinc-500">
              Collaborations
            </p>

            <p className="mt-2 text-4xl font-black">
              {user.memberships.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111113] p-6">
            <Sparkles className="mb-5 h-6 w-6 text-emerald-400" />

            <p className="text-sm text-zinc-500">
              Total Contributions
            </p>

            <p className="mt-2 text-4xl font-black">
              {totalContributions}
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">
            <div className="mb-6">
              <h2 className="text-3xl font-black">
                Created Projects
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Repositories started by you.
              </p>
            </div>

            {user.projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
                No projects created yet.
              </div>
            ) : (
              <div className="space-y-3">
                {user.projects.map(
                  (project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-violet-500/40"
                    >
                      <h3 className="text-xl font-bold">
                        {project.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-zinc-400">
                        {project.description}
                      </p>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">
            <h2 className="mb-6 text-3xl font-black">
              Edit Profile
            </h2>

            <EditProfileForm
              bio={user.bio}
              avatarUrl={user.avatarUrl}
              skills={user.skills}
              githubUrl={user.githubUrl}
              linkedinUrl={user.linkedinUrl}
            />
          </div>
        </section>

      </div>
    </main>
  );
}