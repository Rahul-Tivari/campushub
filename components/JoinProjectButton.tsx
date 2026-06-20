"use client";

import { toast } from "sonner";

interface Props {
  projectId: string;
}

export default function JoinProjectButton({
  projectId,
}: Props) {

  const handleJoin = async () => {

    const response = await fetch(
      `/api/projects/${projectId}/join`,
      {
        method: "POST",
      }
    );

    if (response.ok) {

      toast.success(
        "Request sent successfully"
      );

      window.location.reload();

    } else {

      const error =
        await response.text();

      toast.error(error);
    }
  };

  return (
    <button
      onClick={handleJoin}
      className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200"
    >
      Join Project
    </button>
  );
}