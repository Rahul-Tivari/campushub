import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {

  const session =
    await getServerSession();

  if (!session?.user?.email) {

    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  }

  const body =
    await request.json();

  const { title, content } =
    body;

  const user =
    await prisma.user.findUnique({

      where: {
        email:
          session.user.email,
      },

    });

  if (!user) {

    return NextResponse.json(
      {
        error: "User not found",
      },
      {
        status: 404,
      }
    );

  }

  const note =
    await prisma.note.create({

      data: {

        title,

        content,

        userId: user.id,

      },

    });

  return NextResponse.json(
    note
  );
}