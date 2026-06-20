import { prisma } from "@/lib/prisma";

import ExploreClient from "@/components/ExploreClient";

export default async function ExplorePage() {

  const projects =
    await prisma.project.findMany({

      include: {
        author: true,
        members: true,
        discussions: true,
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

            Explore Projects

          </h1>

          <p className="mt-4 text-zinc-400">

            Discover innovative
            student projects and
            collaborators across campus.

          </p>

        </div>

        <ExploreClient
          initialProjects={projects}
        />

      </div>

    </div>
  );
}