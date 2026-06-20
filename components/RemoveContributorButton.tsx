"use client";

import { toast } from "sonner";

interface Props {
  memberId: string;
  projectId: string;
}

export default function RemoveContributorButton({
  memberId,
  projectId,
}: Props) {
  const handleRemove = async () => {
    const response = await fetch(
      `/api/projects/${projectId}/remove-member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
        }),
      }
    );

    if (response.ok) {
      toast.error("Contributor removed");
      location.reload();
    } else {
      const error =
        await response.text();

      toast.error(error);
    }
  };

  return (
    <button
      onClick={handleRemove}
      className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Remove
    </button>
  );
}