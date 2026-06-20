"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  bio?: string | null;

  avatarUrl?: string | null;

  skills?: string | null;

  githubUrl?: string | null;

  linkedinUrl?: string | null;
}

export default function EditProfileForm({

  bio: initialBio,

  avatarUrl: initialAvatar,

  skills: initialSkills,

  githubUrl: initialGithub,

  linkedinUrl: initialLinkedin,

}: Props) {

  const [bio, setBio] =
    useState(initialBio || "");

  const [avatarUrl, setAvatarUrl] =
    useState(initialAvatar || "");

  const [skills, setSkills] =
    useState(initialSkills || "");

  const [githubUrl, setGithubUrl] =
    useState(initialGithub || "");

  const [linkedinUrl, setLinkedinUrl] =
    useState(initialLinkedin || "");

  const [loading, setLoading] =
    useState(false);

  const handleSave = async () => {

    setLoading(true);

    const response =
      await fetch("/api/profile", {

        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          bio,

          avatarUrl,

          skills,

          githubUrl,

          linkedinUrl,

        }),

      });

    setLoading(false);

    if (response.ok) {

      toast.success(
        "Profile updated!"
      );

      location.reload();

    } else {

      toast.error(
        "Failed to update profile"
      );

    }

  };

  return (

    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="mb-6 text-3xl font-black">

        Edit Profile

      </h2>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Avatar Image URL"
          value={avatarUrl}
          onChange={(e) =>
            setAvatarUrl(
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
        />

        <textarea
          placeholder="Write something about yourself..."
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
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 font-bold text-white"
        >

          {loading
            ? "Saving..."
            : "Save Profile"}

        </button>

      </div>

    </div>
  );
}