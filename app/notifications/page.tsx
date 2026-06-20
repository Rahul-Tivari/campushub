import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import NotificationsClient from "@/components/NotificationsClient";

export default async function NotificationsPage() {

  const session =
    await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email:
          session.user.email,
      },
    });

  if (!user) {
    redirect("/login");
  }
await prisma.notification.updateMany({
  where: {
    userId: user.id,
    isRead: false,
  },
  data: {
    isRead: true,
  },
});
  return (

    <div className="min-h-screen px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-10 text-5xl font-black tracking-tight">
          Notifications
        </h1>

        <NotificationsClient />

      </div>

    </div>

  );
}