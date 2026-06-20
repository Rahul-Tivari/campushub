"use client";

import { toast } from "sonner";

interface Props {
  discussionId: string;
}

export default function DeleteDiscussionButton({
  discussionId,
}: Props) {

  const handleDelete =
    async () => {

      const confirmed =
        confirm(
          "Delete this discussion?"
        );

      if (!confirmed) {
        return;
      }

      try {

        const response =
          await fetch(
            `/api/discussions/${discussionId}`,
            {
              method: "DELETE",
            }
          );

        if (response.ok) {

          window.location.reload();

        } else {

          const error =
            await response.text();

          toast.error(error);
        }

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-300 text-sm font-medium"
    >
      Delete
    </button>
  );
}