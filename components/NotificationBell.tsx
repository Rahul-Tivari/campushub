"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch(
          "/api/notifications/count"
        );

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        setCount(data.count || 0);
      } catch (error) {
        console.log(
          "Notification count fetch failed",
          error
        );
      }
    }

    fetchCount();

    const interval = setInterval(
      fetchCount,
      5000
    );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Bell className="h-6 w-6" />

      {count > 0 && (
        <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {count}
        </div>
      )}
    </div>
  );
}