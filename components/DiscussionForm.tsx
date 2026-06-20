"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

export default function DiscussionForm({
  projectId,
}: Props) {

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (!content.trim()) {
        return;
      }

      try {

        setLoading(true);

        const response =
          await fetch(
            `/api/projects/${projectId}/discussions`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                content,
              }),
            }
          );

        if (response.ok) {

          setContent("");

          window.location.reload();

        } else {

          const error =
            await response.text();

          toast.error(error);
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <textarea
        placeholder="Start a discussion..."
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        className="w-full min-h-[120px] bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading
          ? "Posting..."
          : "Post Discussion"}
      </button>

    </form>
  );
}