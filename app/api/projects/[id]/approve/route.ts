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

    const { id } = await params;

    const body =
      await request.json();

    const { requestId } = body;

    const currentUser =
      await prisma.user.findUnique({
        where: {
          email:
            session.user.email,
        },
      });

    const project =
      await prisma.project.findUnique({
        where: {
          id,
        },
      });

    if (
      !project ||
      project.authorId !==
        currentUser?.id
    ) {
      return new NextResponse(
        "Forbidden",
        {
          status: 403,
        }
      );
    }

    const collaborationRequest =
      await prisma.collaborationRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!collaborationRequest) {
      return new NextResponse(
        "Request not found",
        {
          status: 404,
        }
      );
    }

const existingMember =
  await prisma.projectMember.findFirst({

    where: {

      userId:
        collaborationRequest.userId,

      projectId: id,

    },

  });

if (existingMember) {

  return NextResponse.json({
    success: true,
  });

}

    await prisma.projectMember.create({
      data: {
        userId:
          collaborationRequest.userId,
        projectId: id,
      },
    });

    await prisma.collaborationRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "APPROVED",
      },
    });

await prisma.notification.create({

  data: {

    content:
      `You were approved to join ${project.title}`,

    userId:
      collaborationRequest.userId,

  },

});

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(
      "[APPROVE_REQUEST]",
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