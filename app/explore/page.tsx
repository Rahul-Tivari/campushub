export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import ExploreClient from "@/components/ExploreClient";
import {
  Compass,
  Sparkles,
  Users,
  MessageSquare,
} from "lucide-react";

export default async function ExplorePage() {
  const projects =
    await prisma.project.findMany({
      include: {
        author: true,
        members: true,
        discussions: true,
        stars: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const totalMembers =
    projects.reduce(
      (total, project) =>
        total + project.members.length,
      0
    );

  const totalDiscussions =
    projects.reduce(
      (total, project) =>
        total + project.discussions.length,
      0
    );

  return (
    <main className="min-h-screen bg-[#09090B] px-6 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">

        <section className="rounded-[2rem] border border-white/10 bg-[#111113] p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
                Explore CampusHub
              </p>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Discover student-built projects.
              </h1>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Browse academic repositories, find collaborators, and explore what students are building across campus.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <Compass className="mb-3 h-5 w-5 text-violet-400" />
                <p className="text-2xl font-black">
                  {projects.length}
                </p>
                <p className="text-sm text-zinc-500">
                  Projects
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <Users className="mb-3 h-5 w-5 text-cyan-400" />
                <p className="text-2xl font-black">
                  {totalMembers}
                </p>
                <p className="text-sm text-zinc-500">
                  Members
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <MessageSquare className="mb-3 h-5 w-5 text-emerald-400" />
                <p className="text-2xl font-black">
                  {totalDiscussions}
                </p>
                <p className="text-sm text-zinc-500">
                  Discussions
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 w-fit">
          <Sparkles className="h-4 w-4 text-violet-400" />
          Public project discovery
        </div>

        <ExploreClient
          initialProjects={projects}
        />
      </div>
    </main>
  );
}