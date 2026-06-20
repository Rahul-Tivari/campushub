"use client";

import { useState } from "react";

interface Props {
  projectId: string;

  initialStarred: boolean;

  initialCount: number;
}

export default function StarButton({
  projectId,
  initialStarred,
  initialCount,
}: Props) {

  const [starred, setStarred] =
    useState(initialStarred);

  const [count, setCount] =
    useState(initialCount);

  const [loading, setLoading] =
    useState(false);

  const handleStar =
    async () => {

      setLoading(true);

      const response =
        await fetch(
          `/api/projects/${projectId}/star`,
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (data.starred) {

        setStarred(true);

        setCount((prev) => prev + 1);

      } else {

        setStarred(false);

        setCount((prev) => prev - 1);

      }

      setLoading(false);
    };

  return (

    <button
      onClick={handleStar}
      disabled={loading}
      className={`rounded-2xl px-6 py-3 font-bold transition ${
        starred
          ? "bg-yellow-500 text-black"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >

      ⭐ {count}

    </button>
  );
}