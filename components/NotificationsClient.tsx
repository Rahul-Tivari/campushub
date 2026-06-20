"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

interface Notification {
  id: string;
  content: string;
  createdAt: string;
}

export default function NotificationsClient() {

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const fetchNotifications =
    useCallback(async () => {

      const response =
        await fetch(
          "/api/notifications"
        );

      const data =
        await response.json();

      setNotifications(data);

    }, []);

  useEffect(() => {

    const load = async () => {
      await fetchNotifications();
    };

    load();

    const interval =
      setInterval(() => {

        fetchNotifications();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [fetchNotifications]);

  return (

    <div className="space-y-4">

      {notifications.length === 0 ? (

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl">

          No notifications yet.

        </div>

      ) : (

        notifications.map(
          (notification) => (

            <div
              key={notification.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >

              <p className="text-lg text-white">

                {notification.content}

              </p>

              <p className="mt-3 text-sm text-zinc-500">

                {new Date(
                  notification.createdAt
                ).toLocaleString()}

              </p>

            </div>

          )
        )

      )}

    </div>
  );
}