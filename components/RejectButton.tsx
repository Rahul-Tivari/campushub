"use client";

import { toast } from "sonner";

interface Props {
  requestId: string;
  projectId: string;
}

export default function RejectButton({
  requestId,
  projectId,
}: Props) {

  const handleReject =
    async () => {

      const response =
        await fetch(
          `/api/projects/${projectId}/reject`,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              requestId,
            }),

          }
        );

      if (response.ok) {

        toast.error(
          "Request rejected"
        );

        location.reload();

      }

    };

  return (

    <button
      onClick={handleReject}
      className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
    >

      Reject

    </button>

  );

}