"use client";

import { toast } from "sonner";

interface Props {
  requestId: string;
  projectId: string;
}

export default function ApproveButton({
  requestId,
  projectId,
}: Props) {

  const handleApprove =
    async () => {

      const response =
        await fetch(
          `/api/projects/${projectId}/approve`,
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

        toast.success(
          "Request approved!"
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
      onClick={handleApprove}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
    >
      Approve
    </button>
  );
}