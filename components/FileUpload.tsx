"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

export default function FileUpload({
  projectId,
}: Props) {

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const handleUpload =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (!file) {
        return;
      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await fetch(
            `/api/projects/${projectId}/files`,
            {
              method: "POST",
              body: formData,
            }
          );

        if (response.ok) {

          toast.success(
            "File uploaded!"
          );

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
      onSubmit={handleUpload}
      className="space-y-4"
    >

      <input
        type="file"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] || null
          )
        }
        className="block w-full text-sm text-zinc-400"
      />

      <button
        type="submit"
        disabled={
          !file || loading
        }
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        {loading
          ? "Uploading..."
          : "Upload File"}
      </button>

    </form>
  );
}