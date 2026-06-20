import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: Props
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

    const { id } = await params;

    const discussion =
      await prisma.discussion.findUnique({
        where: {
          id,
        },

        include: {
          project: true,
        },
      });

    if (!discussion) {

      return new NextResponse(
        "Discussion not found",
        {
          status: 404,
        }
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

      return new NextResponse(
        "User not found",
        {
          status: 404,
        }
      );
    }

    const isOwner =
      discussion.project.authorId ===
      user.id;

    const isAuthor =
      discussion.userId ===
      user.id;

    if (!isOwner && !isAuthor) {

      return new NextResponse(
        "Forbidden",
        {
          status: 403,
        }
      );
    }

    await prisma.discussion.delete({
      where: {
        id,
      },
    });

    return new NextResponse(
      "Deleted",
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "[DISCUSSION_DELETE]",
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