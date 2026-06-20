"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  description: string;

  ownerId: string;

  owner: {
    name?: string | null;
    email?: string | null;
  };

members: {
  id: string;
  userId: string;

  user: {
    name?: string | null;
    email?: string | null;
  };
}[];
requests: {
  id: string;
  userId: string;
  status: string;

  user: {
    name?: string | null;
    email?: string | null;
  };
}[];
}
interface Props {
  initialTeams: Team[];
}

export default function TeamsClient({
  initialTeams,
}: Props) {
  const { data: session } = useSession();

const router = useRouter();

  const [teams, setTeams] =
    useState(initialTeams);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const handleCreate =
    async () => {
      const response =
        await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            description,
          }),
        });

      if (!response.ok) {
        const error =
          await response.text();

      toast.error(error);
        return;
      }

      const team =
        await response.json();

      setTeams([
        team,
        ...teams,
      ]);

      setName("");
      setDescription("");

      toast.success("Team created");
    };

  const handleJoinTeam =
    async (teamId: string) => {
      const response =
        await fetch(
          `/api/teams/${teamId}/join`,
          {
            method: "POST",
          }
        );

      if (response.ok) {
        toast.success("Team join request sent");
        location.reload();
      } else {
        const error =
          await response.text();

        toast.error(error);
      }
    };

  const handleApprove =
    async (
      teamId: string,
      requestId: string
    ) => {
      const response =
        await fetch(
          `/api/teams/${teamId}/approve`,
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
        toast.success("Team request approved");
        location.reload();
      } else {
        const error =
          await response.text();

        toast.error(error);
      }
    };

  const handleReject =
    async (
      teamId: string,
      requestId: string
    ) => {
      const response =
        await fetch(
          `/api/teams/${teamId}/reject`,
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
        toast.success("Team request rejected");
        location.reload();
      } else {
        const error =
          await response.text();

        toast.error(error);
      }
    };

  const getTeamButton = (team: Team) => {
    const currentUserEmail =
      session?.user?.email;

    const isOwner =
      team.owner.email ===
      currentUserEmail;

const isMember =
  team.members.some(
    (member) =>
      member.user.email === currentUserEmail
  );
const hasPendingRequest =
  team.requests.some(
    (request) =>
      request.status === "PENDING" &&
      request.user.email === currentUserEmail
  );
    if (isOwner) {
      return (
        <button
          disabled
          className="mt-5 rounded-xl bg-zinc-700 px-5 py-2 font-semibold text-zinc-300"
        >
          Owner
        </button>
      );
    }

    if (isMember) {
      return (
        <button
          disabled
          className="mt-5 rounded-xl bg-green-700 px-5 py-2 font-semibold text-white"
        >
          Joined
        </button>
      );
    }

    if (hasPendingRequest) {
      return (
        <button
          disabled
          className="mt-5 rounded-xl bg-yellow-600 px-5 py-2 font-semibold text-white"
        >
          Requested
        </button>
      );
    }

    return (
      <button
       onClick={(e) => {
  e.stopPropagation();
  handleJoinTeam(team.id);
}}
        className="mt-5 rounded-xl bg-white px-5 py-2 font-semibold text-black hover:bg-zinc-200"
      >
        Join Team
      </button>
    );
  };

  return (
    <div className="grid gap-10 lg:grid-cols-3">

      <div className="rounded-[2rem] border border-white/10 bg-[#111113] p-6 shadow-xl shadow-black/20">
        <h2 className="mb-6 text-3xl font-black">
          Create Team
        </h2>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Team Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <textarea
            placeholder="Describe your team..."
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="h-40 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <button
            onClick={handleCreate}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 py-4 font-bold"
          >
            Create Team
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
      <div className="grid gap-6 md:grid-cols-2">
  {teams.length === 0 ? (
    <div className="col-span-full rounded-[2rem] border border-dashed border-white/10 p-10 text-center text-zinc-500">
      No teams created yet.
    </div>
  ) : (
    teams.map((team) => {
            const isOwner =
              team.owner.email ===
              session?.user?.email;

            const pendingRequests =
              team.requests.filter(
                (request) =>
                  request.status ===
                  "PENDING"
              );

            return (
             <div
  key={team.id}
  onClick={() =>
    router.push(`/teams/${team.id}`)
  }
  className="group cursor-pointer rounded-[2rem] border border-white/10 bg-[#111113] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
>
  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-xl font-black text-cyan-300">
  {team.name.charAt(0).toUpperCase()}
</div>
                <h3 className="text-2xl font-bold">
                  {team.name}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {team.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">
                    Owner:{" "}
                    {team.owner.name ||
                      team.owner.email}
                  </p>

                  <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
  👥 {team.members.length}
</div>
                </div>

                {getTeamButton(team)}

                {isOwner &&
                  pendingRequests.length > 0 && (
                    <div className="mt-6 border-t border-white/10 pt-5">
                      <h4 className="mb-4 text-lg font-bold text-white">
                        Pending Requests
                      </h4>

                      <div className="space-y-3">
                        {pendingRequests.map(
                          (request) => (
                            <div
                              key={request.id}
                              className="flex items-center justify-between rounded-2xl bg-black/30 p-4"
                            >
                              <div>
                                <p className="font-semibold text-white">
                                  {request.user
                                    ?.name ||
                                    request.user
                                      ?.email ||
                                    "User"}
                                </p>

                                <p className="text-sm text-zinc-500">
                                  {
                                    request.user
                                      ?.email
                                  }
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
  e.stopPropagation();

  handleApprove(
    team.id,
    request.id
  );
}}
                                  className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={(e) => {
  e.stopPropagation();

  handleReject(
    team.id,
    request.id
  );
}}
                                  className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            );
          })
          )}
        </div>
      </div>

    </div>
  );
}