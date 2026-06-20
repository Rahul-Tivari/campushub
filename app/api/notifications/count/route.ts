import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({
      count: 0,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json({
      count: 0,
    });
  }

  const count = await prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false,
    },
  });

  return NextResponse.json({
    count,
  });
}