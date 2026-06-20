import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
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

    const body =
      await request.json();

    const { content } = body;

    if (!content) {

      return new NextResponse(
        "Content required",
        {
          status: 400,
        }
      );
    }

    const { id } = await params;

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

    const discussion =
      await prisma.discussion.create({
        data: {
          content,
          userId: user.id,
          projectId: id,
        },
      });

const project =
  await prisma.project.findUnique({

    where: {
      id,
    },

  });

const members =
  await prisma.projectMember.findMany({

    where: {
      projectId: id,
    },

  });

for (const member of members) {

  if (
    member.userId !==
    user.id
  ) {

    await prisma.notification.create({

      data: {

        content:
          `${user.name || "Someone"} posted in ${project?.title}`,

        userId:
          member.userId,

      },

    });

  }

}
      
    return NextResponse.json(
      discussion
    );

  } catch (error) {

    console.log(
      "[DISCUSSION_POST]",
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