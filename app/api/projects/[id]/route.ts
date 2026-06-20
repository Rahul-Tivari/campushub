import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    const session =
      await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse(
        "Unauthorized",
        {
          status: 401,
        }
      );
    }

    const { id } =
      await params;

    const project =
      await prisma.project.findUnique({
        where: {
          id,
        },
        include: {
          author: true,
        },
      });

    if (!project) {
      return new NextResponse(
        "Project not found",
        {
          status: 404,
        }
      );
    }

    if (
      project.author.email !==
      session.user.email
    ) {
      return new NextResponse(
        "Forbidden",
        {
          status: 403,
        }
      );
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(
      "[PROJECT_DELETE]",
      error
    );

    return new NextResponse(
      "Internal Error",
      {
        status: 500,
      }
    );
  }
}