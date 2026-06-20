import Link from "next/link";
import {
  FolderKanban,
  Users,
  FileText,
  MessageSquare,
  Plus,
  Compass,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalProjects =
    await prisma.project.count({
      where: {
        authorId: user.id,
      },
    });

  const collaborations =
    await prisma.projectMember.count({
      where: {
        userId: user.id,
      },
    });

  const uploadedFiles =
    await prisma.projectFile.count({
      where: {
        project: {
          OR: [
            {
              authorId: user.id,
            },
            {
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
      },
    });

  const discussions =
    await prisma.discussion.count({
      where: {
        userId: user.id,
      },
    });

  const teams =
    await prisma.team.count({
      where: {
        OR: [
          {
            ownerId: user.id,
          },
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
    });

  const pendingRequests =
    await prisma.collaborationRequest.count({
      where: {
        project: {
          authorId: user.id,
        },
        status: "PENDING",
      },
    });

  const recentProjects =
    await prisma.project.findMany({
      where: {
        OR: [
          {
            authorId: user.id,
          },
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
      include: {
        author: true,
        members: true,
        stars: true,
      },
    });

  const recentDiscussions =
    await prisma.discussion.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: true,
        project: true,
      },
    });

  const displayName =
    user.name ||
    session.user.email.split("@")[0];

  const stats = [
    {
      label: "Projects",
      value: totalProjects,
      helper: "Owned by you",
      icon: FolderKanban,
      accent: "bg-violet-500/15 text-violet-300",
    },
    {
      label: "Teams",
      value: teams,
      helper: "Your workspaces",
      icon: Users,
      accent: "bg-emerald-500/15 text-emerald-300",
    },
    {
      label: "Requests",
      value: pendingRequests,
      helper: "Awaiting review",
      icon: Sparkles,
      accent: "bg-amber-500/15 text-amber-300",
    },
    {
      label: "Files",
      value: uploadedFiles,
      helper: "Shared resources",
      icon: FileText,
      accent: "bg-sky-500/15 text-sky-300",
    },
    {
      label: "Discussions",
      value: discussions,
      helper: "Your messages",
      icon: MessageSquare,
      accent: "bg-fuchsia-500/15 text-fuchsia-300",
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090B] px-6 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111113] p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
                CampusHub Dashboard
              </p>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Good evening, {displayName}! 👋
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Manage your projects, teams, discussions, and resources from one clean workspace.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6">
              <p className="text-sm text-zinc-400">
                Active workspace
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {totalProjects + collaborations + teams}
              </p>

              <p className="mt-1 text-sm text-violet-300">
                projects + teams + collaborations
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-3xl border border-white/10 bg-[#111113] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#151518]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className={`rounded-2xl p-3 ${stat.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="text-xs text-zinc-500">
                    Live
                  </span>
                </div>

                <p className="text-sm text-zinc-400">
                  {stat.label}
                </p>

                <h2 className="mt-2 text-4xl font-black">
                  {stat.value}
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  {stat.helper}
                </p>
              </div>
            );
          })}
        </section>

        {/* MAIN GRID */}
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

          {/* RECENT PROJECTS */}
          <div className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Recent Projects
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Projects you own or collaborate on.
                </p>
              </div>

              <Link
                href="/projects"
                className="text-sm font-medium text-violet-400 hover:text-violet-300"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-zinc-500">
                  No projects yet. Start by creating your first project.
                </div>
              ) : (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/40 hover:bg-white/[0.04]"
                  >
                    <div>
                      <h3 className="font-bold text-white">
                        {project.title}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                        {project.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.techStack
                          .split(",")
                          .slice(0, 3)
                          .map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="text-right text-sm text-zinc-500">
                      <p>{project.members.length} members</p>
                      <p>{project.stars.length} stars</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">
            <h2 className="text-2xl font-black">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Jump into common workflows.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/projects"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/40 hover:bg-white/[0.04]"
              >
                <div>
                  <p className="font-semibold">
                    Create New Project
                  </p>

                  <p className="text-sm text-zinc-500">
                    Start a new academic repository
                  </p>
                </div>

                <Plus className="h-5 w-5 text-violet-400" />
              </Link>

              <Link
                href="/explore"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/40 hover:bg-white/[0.04]"
              >
                <div>
                  <p className="font-semibold">
                    Explore Projects
                  </p>

                  <p className="text-sm text-zinc-500">
                    Discover student work
                  </p>
                </div>

                <Compass className="h-5 w-5 text-violet-400" />
              </Link>

              <Link
                href="/teams"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/40 hover:bg-white/[0.04]"
              >
                <div>
                  <p className="font-semibold">
                    Manage Teams
                  </p>

                  <p className="text-sm text-zinc-500">
                    Build collaboration groups
                  </p>
                </div>

                <Users className="h-5 w-5 text-violet-400" />
              </Link>

              <Link
                href="/notes"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/40 hover:bg-white/[0.04]"
              >
                <div>
                  <p className="font-semibold">
                    Write a Note
                  </p>

                  <p className="text-sm text-zinc-500">
                    Capture ideas and plans
                  </p>
                </div>

                <NotebookPen className="h-5 w-5 text-violet-400" />
              </Link>
            </div>
          </div>

        </section>

        {/* ACTIVITY */}
        <section className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Recent Discussions
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Latest project conversations across CampusHub.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {recentDiscussions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-zinc-500 md:col-span-2">
                No recent discussions yet.
              </div>
            ) : (
              recentDiscussions.map((discussion) => (
                <Link
                  key={discussion.id}
                  href={`/projects/${discussion.projectId}`}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/40 hover:bg-white/[0.04]"
                >
                  <p className="text-sm font-medium text-zinc-300">
                    {discussion.user.name ||
                      discussion.user.email}
                  </p>

                  <p className="mt-2 line-clamp-2 text-zinc-400">
                    {discussion.content}
                  </p>

                  <p className="mt-3 text-xs text-violet-400">
                    in {discussion.project.title}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}