import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

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

    const projects = await prisma.project.findMany({
      where: {
        authorId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        author: true,
      },
    });

    return NextResponse.json(projects);

  } catch (error) {

    console.log("[PROJECTS_GET]", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });

  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const {
      title,
      description,
      techStack,
      githubUrl,
    } = body;

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

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        githubUrl,
        authorId: user.id,
      },
    });

    return NextResponse.json(project);

  } catch (error) {
    console.log("[PROJECTS_POST]", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}