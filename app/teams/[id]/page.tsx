import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TeamsClient from "@/components/TeamsClient";
import {
  Users,
  Sparkles,
  UserPlus,
} from "lucide-react";

export default async function TeamsPage() {
  const session =
    await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const teams =
    await prisma.team.findMany({
      include: {
        owner: true,

        members: {
          include: {
            user: true,
          },
        },

        requests: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const totalMembers =
    teams.reduce(
      (total, team) =>
        total + team.members.length,
      0
    );

  const pendingRequests =
    teams.reduce(
      (total, team) =>
        total +
        team.requests.filter(
          (request) =>
            request.status === "PENDING"
        ).length,
      0
    );

  return (
    <main className="min-h-screen bg-[#09090B] px-6 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-[#111113] p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
                Teams Workspace
              </p>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Build student collaboration groups.
              </h1>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Create academic teams, manage join requests, and organize students around projects and research work.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <Users className="mb-3 h-5 w-5 text-violet-400" />

                <p className="text-2xl font-black">
                  {teams.length}
                </p>

                <p className="text-sm text-zinc-500">
                  Teams
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <Sparkles className="mb-3 h-5 w-5 text-cyan-400" />

                <p className="text-2xl font-black">
                  {totalMembers}
                </p>

                <p className="text-sm text-zinc-500">
                  Members
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <UserPlus className="mb-3 h-5 w-5 text-amber-400" />

                <p className="text-2xl font-black">
                  {pendingRequests}
                </p>

                <p className="text-sm text-zinc-500">
                  Requests
                </p>
              </div>
            </div>
          </div>
        </section>

        <TeamsClient
          initialTeams={teams}
        />
      </div>
    </main>
  );
}