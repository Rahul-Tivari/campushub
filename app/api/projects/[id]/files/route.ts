import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

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

    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("File required", {
        status: 400,
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

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        members: true,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", {
        status: 404,
      });
    }

    const isOwner = project.authorId === user.id;

    const isMember = project.members.some(
      (member) => member.userId === user.id
    );

    if (!isOwner && !isMember) {
      return new NextResponse("Forbidden", {
        status: 403,
      });
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const safeFileName = file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    );

    const filePath =
      `${id}/${Date.now()}-${safeFileName}`;

    const { error } =
      await supabase.storage
        .from("project-files")
        .upload(filePath, buffer, {
          contentType: file.type,
        });

    if (error) {
      console.log(error);

      return new NextResponse("Upload failed", {
        status: 500,
      });
    }


const projectFile =
  await prisma.projectFile.create({
    data: {
      name: file.name,
      url: filePath,
      type: file.type,
      uploaderId: user.id,
      projectId: id,
    },
  });

    for (const member of project.members) {
      if (member.userId !== user.id) {
        await prisma.notification.create({
          data: {
            content:
              `${user.name || "Someone"} uploaded a file in ${project.title}`,
            userId: member.userId,
          },
        });
      }
    }

    if (project.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          content:
            `${user.name || "Someone"} uploaded a file in ${project.title}`,
          userId: project.authorId,
        },
      });
    }

    return NextResponse.json(projectFile);
  } catch (error) {
    console.log("[FILE_UPLOAD]", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}