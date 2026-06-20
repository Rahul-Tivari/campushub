"use client";

import { useSession } from "next-auth/react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { toast } from "sonner";

interface Project {
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
}

export default function ProjectsPage() {
  const router = useRouter();

  const {
    data: session,
    status,
  } = useSession();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [search, setSearch] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [techStack, setTechStack] =
    useState("");

  const [githubUrl, setGithubUrl] =
    useState("");

  const fetchProjects =
    useCallback(async () => {
      const response =
        await fetch("/api/projects");

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data =
        await response.json();

      setProjects(data);
    }, [router]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    const loadProjects = async () => {
      await fetchProjects();
    };

    loadProjects();
  }, [
    status,
    session,
    router,
    fetchProjects,
  ]);

  const handleCreateProject =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !title.trim() ||
        !description.trim() ||
        !techStack.trim()
      ) {
        toast.error(
          "Title, description and tech stack are required"
        );
        return;
      }

      const response =
        await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            techStack,
            githubUrl,
          }),
        });

      if (response.ok) {
        toast.success("Project created");

        setTitle("");
        setDescription("");
        setTechStack("");
        setGithubUrl("");

        fetchProjects();
      } else {
        const error =
          await response.text();

        toast.error(
          error ||
            "Failed to create project"
        );
      }
    };

  const handleDeleteProject =
    async (id: string) => {
      const response =
        await fetch(
          `/api/projects/${id}`,
          {
            method: "DELETE",
          }
        );

      if (response.ok) {
        toast.success("Project deleted");
        fetchProjects();
      } else {
        toast.error(
          "Failed to delete project"
        );
      }
    };

  const filteredProjects =
    projects.filter((project) => {
      const query =
        search.toLowerCase();

      return (
        project.title
          .toLowerCase()
          .includes(query) ||
        project.description
          .toLowerCase()
          .includes(query) ||
        project.techStack
          .toLowerCase()
          .includes(query)
      );
    });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-zinc-400">
        Loading projects...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] px-6 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <section className="rounded-[2rem] border border-white/10 bg-[#111113] p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
                Projects Workspace
              </p>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Build your academic projects.
              </h1>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Create repositories, manage contributors, share files, and track discussions from one focused workspace.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-violet-600 p-3">
                  <FolderKanban className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-zinc-400">
                    Your Projects
                  </p>

                  <p className="text-3xl font-black">
                    {projects.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

            <input
              type="text"
              placeholder="Search by title, description or tech stack..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-[#111113] py-4 pl-14 pr-5 text-white outline-none transition focus:border-violet-500/50"
            />
          </div>
        </section>

        {/* CREATE PROJECT */}
        <section className="rounded-[2rem] border border-white/10 bg-[#111113] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
              <Plus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Create New Project
              </h2>

              <p className="text-sm text-zinc-500">
                Add a new academic project repository.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateProject}
            className="grid gap-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Project Title"
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition focus:border-violet-500/50"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Tech Stack e.g. Next.js, Prisma, PostgreSQL"
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition focus:border-violet-500/50"
                value={techStack}
                onChange={(e) =>
                  setTechStack(e.target.value)
                }
              />
            </div>

            <textarea
              placeholder="Project Description"
              className="min-h-32 rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition focus:border-violet-500/50"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <input
                type="text"
                placeholder="GitHub URL (optional)"
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition focus:border-violet-500/50"
                value={githubUrl}
                onChange={(e) =>
                  setGithubUrl(e.target.value)
                }
              />

              <button
                type="submit"
                className="rounded-2xl bg-violet-600 px-8 py-4 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
              >
                Create Project
              </button>
            </div>
          </form>
        </section>

        {/* PROJECT LIST */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Your Repositories
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {filteredProjects.length} result(s)
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 md:flex">
              <Sparkles className="h-4 w-4 text-violet-400" />
              Academic workspace
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#111113] p-12 text-center">
              <h2 className="text-2xl font-bold">
                No Projects Yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-zinc-500">
                Create your first academic project and invite contributors to collaborate.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#111113] p-12 text-center">
              <h2 className="text-2xl font-bold">
                No matching projects
              </h2>

              <p className="mt-3 text-zinc-500">
                Try searching by another title, description, or technology.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserEmail={
                    session?.user?.email || ""
                  }
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}