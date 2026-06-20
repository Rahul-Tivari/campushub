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
    const { requestId } = await request.json();

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team || team.ownerId !== currentUser.id) {
      return new NextResponse("Forbidden", {
        status: 403,
      });
    }

    const teamRequest = await prisma.teamRequest.findUnique({
      where: { id: requestId },
    });

    if (!teamRequest) {
      return new NextResponse("Request not found", {
        status: 404,
      });
    }

    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: teamRequest.userId,
          teamId: id,
        },
      },
    });

    if (!existingMember) {
      await prisma.teamMember.create({
        data: {
          userId: teamRequest.userId,
          teamId: id,
        },
      });
    }

    await prisma.teamRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" },
    });

    await prisma.notification.create({
      data: {
        userId: teamRequest.userId,
        content: `You were approved to join team "${team.name}"`,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("[TEAM_APPROVE]", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}