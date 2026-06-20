"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

interface Props {
  projectId: string;
}

interface Discussion {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function DiscussionList({
  projectId,
}: Props) {

  const [
    discussions,
    setDiscussions,
  ] = useState<Discussion[]>([]);

  const fetchDiscussions =
    useCallback(async () => {

      const response =
        await fetch(
          `/api/projects/${projectId}/discussions`
        );

      const data =
        await response.json();

      setDiscussions(data);

    }, [projectId]);

  useEffect(() => {

    const load = async () => {
      await fetchDiscussions();
    };

    load();

    const interval =
      setInterval(() => {

        fetchDiscussions();

      }, 3000);

    return () =>
      clearInterval(interval);

  }, [fetchDiscussions]);

  return (

    <div className="mt-8 space-y-4">

      {discussions.length === 0 ? (

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl">

          No discussions yet.

        </div>

      ) : (

        discussions.map(
          (discussion) => (

            <div
              key={discussion.id}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-cyan-500/40 hover:bg-white/10"
            >

              <div className="mb-3">

                <p className="text-lg font-bold text-white">

                  {discussion.user.name ||
                    discussion.user.email}

                </p>

                <p className="mt-1 text-sm text-zinc-500">

                  {new Date(
                    discussion.createdAt
                  ).toLocaleString()}

                </p>

              </div>

              <p className="mt-4 whitespace-pre-wrap leading-8 text-zinc-300">

                {discussion.content}

              </p>

            </div>

          )
        )

      )}

    </div>
  );
}