import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

export async function GET() {

  const session =
    await getServerSession();

  if (!session?.user?.email) {

    return NextResponse.json(
      [],
    );

  }

  const user =
    await prisma.user.findUnique({

      where: {
        email:
          session.user.email,
      },

    });

  if (!user) {

    return NextResponse.json(
      [],
    );

  }

  const notifications =
    await prisma.notification.findMany({

      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  return NextResponse.json(
    notifications
  );
}