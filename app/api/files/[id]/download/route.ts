import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const session =
      await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse(
        "Unauthorized",
        { status: 401 }
      );
    }

    const { id } = await params;

    const user =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!user) {
      return new NextResponse(
        "User not found",
        { status: 404 }
      );
    }

    const file =
      await prisma.projectFile.findUnique({
        where: {
          id,
        },
        include: {
          project: {
            include: {
              members: true,
            },
          },
        },
      });

    if (!file) {
      return new NextResponse(
        "File not found",
        { status: 404 }
      );
    }

    const isOwner =
      file.project.authorId === user.id;

    const isMember =
      file.project.members.some(
        (member) =>
          member.userId === user.id
      );

    if (!isOwner && !isMember) {
      return new NextResponse(
        "Forbidden",
        { status: 403 }
      );
    }

    const { data, error } =
      await supabase.storage
        .from("project-files")
        .createSignedUrl(
          file.url,
          60
        );

    if (error || !data?.signedUrl) {
      return new NextResponse(
        "Download failed",
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      data.signedUrl
    );

  } catch (error) {
    console.log(
      "[FILE_DOWNLOAD]",
      error
    );

    return new NextResponse(
      "Internal Error",
      { status: 500 }
    );
  }
}