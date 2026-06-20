import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

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
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const { id } = await params;

    const body = await request.json();

    const { memberId } = body;

    const currentUser =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!currentUser) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    const project =
      await prisma.project.findUnique({
        where: {
          id,
        },
      });

    if (!project) {
      return new NextResponse("Project not found", {
        status: 404,
      });
    }

    if (project.authorId !== currentUser.id) {
      return new NextResponse("Forbidden", {
        status: 403,
      });
    }

    const member =
      await prisma.projectMember.findUnique({
        where: {
          id: memberId,
        },
      });

    if (!member) {
      return new NextResponse("Member not found", {
        status: 404,
      });
    }

    if (member.projectId !== id) {
      return new NextResponse("Invalid member", {
        status: 400,
      });
    }

    await prisma.projectMember.delete({
      where: {
        id: memberId,
      },
    });

    await prisma.collaborationRequest.updateMany({
      where: {
        userId: member.userId,
        projectId: id,
      },
      data: {
        status: "REMOVED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: member.userId,
        content: `You were removed from project "${project.title}"`,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("[REMOVE_MEMBER]", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}