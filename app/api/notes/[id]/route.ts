import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: Props
) {

  const session =
    await getServerSession();

  if (!session?.user?.email) {

    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  }

  const { id } =
    await params;

  await prisma.note.delete({

    where: {
      id,
    },

  });

  return NextResponse.json({
    success: true,
  });
}