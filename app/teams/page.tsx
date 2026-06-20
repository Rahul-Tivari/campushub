import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import TeamsClient from "@/components/TeamsClient";

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

  return (

    <div className="min-h-screen px-6 py-10 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <h1 className="text-6xl font-black tracking-tight">

            Teams Workspace

          </h1>

          <p className="mt-4 text-zinc-400">

            Build collaboration groups
            and student teams.

          </p>

        </div>

        <TeamsClient
          initialTeams={teams}
        />

      </div>

    </div>
  );
}