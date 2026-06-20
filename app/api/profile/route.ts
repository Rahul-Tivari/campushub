import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

export async function PUT(
  request: Request
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

  const body =
    await request.json();

const {
  bio,
  avatarUrl,
  skills,
  githubUrl,
  linkedinUrl,
} = body;
  const updatedUser =
    await prisma.user.update({

      where: {
        email:
          session.user.email,
      },

data: {
  bio,
  avatarUrl,
  skills,
  githubUrl,
  linkedinUrl,
},

    });

  return NextResponse.json(
    updatedUser
  );
}