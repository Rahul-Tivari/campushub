import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  Code2,
  Trash2,
  UserCircle,
} from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    techStack: string;
    githubUrl?: string;
    createdAt: string;
    authorId: string;
    author?: {
      name?: string | null;
      email?: string | null;
    };
  };

  currentUserEmail?: string;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({
  project,
  currentUserEmail,
  onDelete,
}: ProjectCardProps) {
  const router = useRouter();

  const technologies =
    project.techStack
      ?.split(",")
      .map((tech) => tech.trim())
      .filter(Boolean) || [];

  const isOwner =
    project.author?.email ===
    currentUserEmail;

  return (
    <div
      onClick={() =>
        router.push(`/projects/${project.id}`)
      }
      className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111113] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#151518]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 opacity-70" />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            <ExternalLink className="h-5 w-5" />
          </div>

          <h2 className="line-clamp-2 text-2xl font-black tracking-tight text-white">
            {project.title}
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
          Project
        </span>
      </div>

      <p className="line-clamp-3 min-h-[5.25rem] leading-7 text-zinc-400">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {technologies
          .slice(0, 4)
          .map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300"
            >
              {tech}
            </span>
          ))}

        {technologies.length > 4 && (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
            +{technologies.length - 4}
          </span>
        )}
      </div>

      <div className="mt-7 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/users/${project.authorId}`
              );
            }}
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-300"
          >
            <UserCircle className="h-4 w-4" />

            <span>
              {project.author?.name ||
                project.author?.email ||
                "Unknown User"}
            </span>
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CalendarDays className="h-4 w-4" />

            {new Date(
              project.createdAt
            ).toLocaleDateString()}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          {project.githubUrl ? (
            <a
              onClick={(e) =>
                e.stopPropagation()
              }
              href={project.githubUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <Code2 className="h-4 w-4" />
              GitHub
            </a>
          ) : (
            <span className="text-sm text-zinc-600">
              No repository link
            </span>
          )}

          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(project.id);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}