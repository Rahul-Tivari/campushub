"use client";

import { useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;

  name?: string | null;

  email?: string | null;

  bio?: string | null;

  skills?: string | null;

  githubUrl?: string | null;

  linkedinUrl?: string | null;

  avatarUrl?: string | null;

  projects: {
    id: string;
  }[];
}

interface Props {
  user: User;
}

export default function ProfileClient({
  user,
}: Props) {

  const [bio, setBio] =
    useState(user.bio || "");

  const [skills, setSkills] =
    useState(user.skills || "");

  const [githubUrl, setGithubUrl] =
    useState(
      user.githubUrl || ""
    );

  const [linkedinUrl, setLinkedinUrl] =
    useState(
      user.linkedinUrl || ""
    );

  const handleSave =
    async () => {

      await fetch(
        "/api/profile",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            bio,

            skills,

            githubUrl,

            linkedinUrl,

          }),

        }
      );

      toast.success(
        "Profile updated!"
      );
    };

  return (

    <div className="space-y-10">

      {/* HERO */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

        <div className="flex flex-col gap-6 md:flex-row md:items-center">

          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-5xl font-black">

            {user.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}

          </div>

          <div>

            <h1 className="text-5xl font-black">

              {user.name ||
                "Anonymous User"}

            </h1>

            <p className="mt-3 text-zinc-400">

              {user.email}

            </p>

            <div className="mt-5 flex gap-3">

              <div className="rounded-full bg-violet-500/20 px-4 py-2 text-violet-300">

                {
                  user.projects
                    .length
                } projects

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* EDIT */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <h2 className="mb-8 text-3xl font-black">

          Edit Profile

        </h2>

        <div className="space-y-6">

          <textarea
            placeholder="Write your bio..."
            value={bio}
            onChange={(e) =>
              setBio(
                e.target.value
              )
            }
            className="h-40 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Skills (React, AI, Node.js...)"
            value={skills}
            onChange={(e) =>
              setSkills(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="GitHub URL"
            value={githubUrl}
            onChange={(e) =>
              setGithubUrl(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="LinkedIn URL"
            value={linkedinUrl}
            onChange={(e) =>
              setLinkedinUrl(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <button
            onClick={handleSave}
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 font-bold"
          >

            Save Profile

          </button>

        </div>

      </div>

    </div>
  );
}