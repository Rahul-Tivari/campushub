"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;

  author: {
    name?: string | null;
    email?: string | null;
  };

  members: {
    id: string;
  }[];

  discussions: {
    id: string;
  }[];
}

interface Props {
  initialProjects: Project[];
}

export default function ExploreClient({
  initialProjects,
}: Props) {
  const router = useRouter();

  const { data: session } =
    useSession();

  const [search, setSearch] =
    useState("");

  const [selectedTech, setSelectedTech] =
    useState("");

  const filteredProjects =
    useMemo(() => {
      return initialProjects.filter(
        (project) => {
          const query =
            search.toLowerCase();

          const matchesSearch =
            project.title
              .toLowerCase()
              .includes(query) ||
            project.description
              .toLowerCase()
              .includes(query) ||
            project.techStack
              .toLowerCase()
              .includes(query);

          const matchesTech =
            selectedTech === "" ||
            project.techStack
              .toLowerCase()
              .includes(
                selectedTech.toLowerCase()
              );

          return (
            matchesSearch &&
            matchesTech
          );
        }
      );
    }, [
      initialProjects,
      search,
      selectedTech,
    ]);

  return (
    <div>
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_260px]">
        <input
          type="text"
          placeholder="Search projects, descriptions, technologies..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="rounded-2xl border border-white/10 bg-[#111113] px-5 py-4 text-white outline-none transition focus:border-violet-500/40"
        />

        <select
          value={selectedTech}
          onChange={(e) =>
            setSelectedTech(
              e.target.value
            )
          }
          className="rounded-2xl border border-white/10 bg-[#111113] px-5 py-4 text-white outline-none transition focus:border-violet-500/40"
        >
          <option value="">
            All Technologies
          </option>

          <option value="react">
            React
          </option>

          <option value="next">
            Next.js
          </option>

          <option value="node">
            Node.js
          </option>

          <option value="python">
            Python
          </option>

          <option value="mongodb">
            MongoDB
          </option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#111113] p-12 text-center">
          <h2 className="text-2xl font-bold">
            No projects found
          </h2>

          <p className="mt-3 text-zinc-500">
            Try changing your search or technology filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                if (session) {
                  router.push(
                    `/projects/${project.id}`
                  );
                }
              }}
              className={`group rounded-[1.75rem] border border-white/10 bg-[#111113] p-6 transition-all duration-300 ${
                session
                  ? "cursor-pointer hover:-translate-y-1 hover:border-violet-500/40"
                  : ""
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="line-clamp-2 text-2xl font-black">
                    {project.title}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    by{" "}
                    {project.author.name ||
                      project.author.email}
                  </p>
                </div>

                <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                  Active
                </div>
              </div>

              <p className="line-clamp-3 min-h-[72px] leading-7 text-zinc-400">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.techStack
                  .split(",")
                  .slice(0, 4)
                  .map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
                    >
                      {tech.trim()}
                    </span>
                  ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <div className="flex gap-4 text-sm">
                  <span className="text-cyan-300">
                    👥 {project.members.length}
                  </span>

                  <span className="text-emerald-300">
                    💬 {project.discussions.length}
                  </span>
                </div>

                {session ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      router.push(
                        `/projects/${project.id}`
                      );
                    }}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
                  >
                    View Project
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}