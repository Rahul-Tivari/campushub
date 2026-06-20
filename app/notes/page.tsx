import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import NotesClient from "@/components/NotesClient";

export default async function NotesPage() {

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
        notes: {
          orderBy: {
            updatedAt: "desc",
          },
        },
      },

    });

  if (!user) {
    redirect("/login");
  }

  return (

    <div className="min-h-screen px-6 py-10 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <h1 className="text-6xl font-black tracking-tight">

            Notes Workspace

          </h1>

          <p className="mt-4 text-zinc-400">

            Organize study material,
            ideas, project plans, and
            research notes.

          </p>

        </div>

        <NotesClient
          initialNotes={user.notes}
        />

      </div>

    </div>
  );
}