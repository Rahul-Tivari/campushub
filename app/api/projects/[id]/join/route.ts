import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  req: Request,
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

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", {
        status: 404,
      });
    }

    if (project.authorId === user.id) {
      return new NextResponse("You own this project", {
        status: 400,
      });
    }

    const existingMembership =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: id,
          },
        },
      });

    if (existingMembership) {
      return new NextResponse("Already joined", {
        status: 400,
      });
    }

const existingRequest =
  await prisma.collaborationRequest.findFirst({
    where: {
      userId: user.id,
      projectId: id,
    },
  });

if (existingRequest?.status === "PENDING") {
  return new NextResponse(
    "You have already requested to join this project",
    {
      status: 400,
    }
  );
}

if (existingRequest?.status === "APPROVED") {
  return new NextResponse(
    "You are already approved for this project",
    {
      status: 400,
    }
  );
}

if (existingRequest?.status === "REJECTED") {
  await prisma.collaborationRequest.update({
    where: {
      id: existingRequest.id,
    },
    data: {
      status: "PENDING",
    },
  });

  await prisma.notification.create({
    data: {
      userId: project.authorId,
      content: `${
        user.name || user.email
      } requested again to join your project "${project.title}"`,
    },
  });

  return NextResponse.json({
    success: true,
  });
}

if (existingRequest?.status === "REMOVED") {
  await prisma.collaborationRequest.update({
    where: {
      id: existingRequest.id,
    },
    data: {
      status: "PENDING",
    },
  });

  await prisma.notification.create({
    data: {
      userId: project.authorId,
      content: `${
        user.name || user.email
      } requested again to join your project "${project.title}"`,
    },
  });

  return NextResponse.json({
    success: true,
  });
}

if (existingRequest) {
  return new NextResponse(
    `Request already exists with status ${existingRequest.status}`,
    {
      status: 400,
    }
  );
}

    await prisma.collaborationRequest.create({
      data: {
        userId: user.id,
        projectId: id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: project.authorId,
        content: `${
          user.name || user.email
        } requested to join your project "${project.title}"`,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("[PROJECT_JOIN]", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}