import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import JoinProjectButton from "@/components/JoinProjectButton";
import DiscussionForm from "@/components/DiscussionForm";
import { getServerSession } from "next-auth";
import ApproveButton from "@/components/ApproveButton";
import DeleteDiscussionButton from "@/components/DeleteDiscussionButton";
import FileUpload from "@/components/FileUpload";
import StarButton from "@/components/StarButton";
import RejectButton from "@/components/RejectButton";
import RemoveContributorButton from "@/components/RemoveContributorButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({
  params,
}: Props) {
  const { id } = await params;
  const session =
  await getServerSession();
  if (!session?.user?.email) {
  redirect("/login");
}
  const project =
    await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
  author: true,
  members: {
    include: {
      user: true,
    },
  },
requests: {
  where: {
    status: "PENDING",
  },
  include: {
    user: true,
  },
},

discussions: {
  include: {
    user: true,
  },

  orderBy: {
    createdAt: "desc",
  },
},
 
stars: true,

files: {
  orderBy: {
    createdAt: "desc",
  },
},

},
    });

const currentUser =
  await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  }); 

if (!project) {
  notFound();
}

  const isOwner =
  currentUser?.id ===
  project.authorId; 

const hasStarred =
  project.stars.some(
    (star) =>
      star.userId ===
      currentUser?.id
  );

const starCount =
  project.stars.length;

  const isMember =
  project.members.some(
    (member) =>
      member.userId ===
      currentUser?.id
  );


  return (
<div className="min-h-screen px-6 py-10 text-white">

  <div className="mx-auto max-w-7xl">

    {/* HERO */}

{/* HERO */}

<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111113] p-8 shadow-2xl shadow-black/30">

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08),transparent_35%)]" />

  <div className="relative z-10">

    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

      <div>

        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
          Project Workspace
        </p>

        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          {project.title}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          {project.techStack
            ?.split(",")
            .map((tech) => (

              <span
                key={tech}
                className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
              >
                {tech.trim()}
              </span>

            ))}

        </div>

      </div>

      <div className="min-w-[240px] rounded-3xl border border-white/10 bg-black/20 p-5">

        <p className="text-sm text-zinc-500">
          Project Owner
        </p>

        <a
          href={`/users/${project.authorId}`}
          className="mt-2 block font-semibold text-cyan-300 hover:underline"
        >
          {project.author.name ||
            project.author.email}
        </a>

        <p className="mt-5 text-sm text-zinc-500">
          Created
        </p>

        <p className="mt-2 text-sm text-zinc-300">
          {new Date(
            project.createdAt
          ).toLocaleDateString()}
        </p>

      </div>

    </div>

    <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex flex-wrap gap-3">

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
          ⭐ {starCount} Stars
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
          👥 {project.members.length} Contributors
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
          💬 {project.discussions.length} Discussions
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
          📁 {project.files.length} Files
        </div>

      </div>

      <div className="flex flex-wrap items-center gap-3">

        <StarButton
          projectId={project.id}
          initialStarred={hasStarred}
          initialCount={starCount}
        />

        {project.githubUrl && (

          <a
            href={project.githubUrl}
            target="_blank"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            Open Repository
          </a>

        )}

        {!session?.user ? (

          <p className="text-zinc-500">
            Login to collaborate
          </p>

        ) : isOwner ? (

          <button
            disabled
            className="rounded-2xl bg-zinc-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Owner
          </button>

        ) : isMember ? (

          <button
            disabled
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Joined
          </button>

        ) : (

          <JoinProjectButton
            projectId={project.id}
          />

        )}

      </div>

    </div>

  </div>

</div>


<div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

  {/* CONTRIBUTORS */}

  <div className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">

    <div className="mb-6 flex items-center justify-between">

      <h2 className="text-3xl font-black">
        Contributors
      </h2>

      <div className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300">
        {project.members.length}
      </div>

    </div>

    <div className="space-y-3">

      {project.members.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-zinc-500">
          No contributors yet
        </div>

      ) : (

        project.members.map((member) => (

          <div
            key={member.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-violet-500/40"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 font-bold text-violet-300">

                {(member.user.name ||
                  member.user.email ||
                  "U")
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <p className="font-semibold text-white">
                  {member.user.name ||
                    member.user.email}
                </p>

                <p className="text-sm text-zinc-500">
                  {member.role}
                </p>

              </div>

            </div>

            {isOwner && (

              <RemoveContributorButton
                memberId={member.id}
                projectId={project.id}
              />

            )}

          </div>

        ))

      )}

    </div>

    {isOwner &&
      project.requests.length > 0 && (

      <div className="mt-8 border-t border-white/10 pt-6">

        <h3 className="mb-4 text-xl font-bold">
          Pending Requests
        </h3>

        <div className="space-y-3">

          {project.requests.map(
            (request) => (

              <div
                key={request.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-semibold">
                      {request.user.name ||
                        "User"}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {request.user.email}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <ApproveButton
                      requestId={
                        request.id
                      }
                      projectId={
                        project.id
                      }
                    />

                    <RejectButton
                      requestId={
                        request.id
                      }
                      projectId={
                        project.id
                      }
                    />

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    )}

  </div>

  {/* DISCUSSIONS */}

  <div className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">

    <h2 className="mb-6 text-3xl font-black">
      Discussions
    </h2>

    <DiscussionForm
      projectId={project.id}
    />

    <div className="mt-6 space-y-4">

      {project.discussions.length ===
      0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
          No discussions yet
        </div>

      ) : (

        project.discussions.map(
          (discussion) => (

            <div
              key={discussion.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-cyan-500/40"
            >

              <div className="flex items-start justify-between">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 font-bold text-cyan-300">

                    {(
                      discussion.user
                        .name ||
                      discussion.user
                        .email ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div>

                    <p className="font-semibold text-white">
                      {discussion.user
                        .name ||
                        discussion.user
                          .email}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {new Date(
                        discussion.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                {(currentUser?.id ===
                  discussion.userId ||

                  currentUser?.id ===
                    project.authorId) && (

                  <DeleteDiscussionButton
                    discussionId={
                      discussion.id
                    }
                  />

                )}

              </div>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-300">
                {discussion.content}
              </p>

            </div>

          )
        )

      )}

    </div>

  </div>

</div>

<div className="mt-12 rounded-[2rem] border border-white/10 bg-[#111113] p-6">

  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

    <div>

      <h2 className="text-3xl font-black">
        Project Resources
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Upload and share files securely with project members.
      </p>

    </div>

    <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
      {project.files.length} files
    </div>

  </div>

  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

    <FileUpload
      projectId={project.id}
    />

  </div>

  <div className="mt-6 space-y-3">

    {project.files.length === 0 ? (

      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
        No files uploaded yet.
      </div>

    ) : (

      project.files.map((file) => (

        <div
          key={file.id}
          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-cyan-500/40 md:flex-row md:items-center md:justify-between"
        >

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-xl">
              📄
            </div>

            <div>

              <p className="font-semibold text-white">
                {file.name}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Uploaded{" "}
                {new Date(
                  file.createdAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

          {(isOwner || isMember) ? (

            <a
              href={`/api/files/${file.id}/download`}
              target="_blank"
              className="rounded-2xl bg-cyan-500/15 px-5 py-3 text-center text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/25"
            >
              Download
            </a>

          ) : (

            <button
              disabled
              className="cursor-not-allowed rounded-2xl bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-500"
            >
              Members Only
            </button>

          )}

        </div>

      ))

    )}

  </div>

</div>

        </div>
      </div>

  );
}