import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: Props
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

  const { id } =
    await params;

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

  const existingStar =
    await prisma.projectStar.findUnique({

      where: {

        userId_projectId: {

          userId: user.id,

          projectId: id,

        },

      },

    });

  if (existingStar) {

    await prisma.projectStar.delete({
      where: {
        id: existingStar.id,
      },
    });

    return NextResponse.json({
      starred: false,
    });

  }

  await prisma.projectStar.create({

    data: {

      userId: user.id,

      projectId: id,

    },

  });

  return NextResponse.json({
    starred: true,
  });
}