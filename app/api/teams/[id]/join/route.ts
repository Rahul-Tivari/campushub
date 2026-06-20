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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    });

    if (!team) {
      return new NextResponse("Team not found", {
        status: 404,
      });
    }

    if (team.ownerId === user.id) {
      return new NextResponse("You own this team", {
        status: 400,
      });
    }

    const existingMember =
      await prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: user.id,
            teamId: id,
          },
        },
      });

    if (existingMember) {
      return new NextResponse("Already a team member", {
        status: 400,
      });
    }

    const existingRequest =
      await prisma.teamRequest.findUnique({
        where: {
          userId_teamId: {
            userId: user.id,
            teamId: id,
          },
        },
      });

    if (existingRequest?.status === "PENDING") {
      return new NextResponse("Request already sent", {
        status: 400,
      });
    }

    if (existingRequest?.status === "APPROVED") {
      return new NextResponse("Already approved", {
        status: 400,
      });
    }

    if (existingRequest?.status === "REJECTED") {
      await prisma.teamRequest.update({
        where: {
          id: existingRequest.id,
        },
        data: {
          status: "PENDING",
        },
      });
    } else {
      await prisma.teamRequest.create({
        data: {
          userId: user.id,
          teamId: id,
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: team.ownerId,
        content: `${user.name || user.email} requested to join your team "${team.name}"`,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("[TEAM_JOIN]", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}