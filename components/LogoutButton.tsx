"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
      className="rounded-lg bg-red-500 px-6 py-3 font-semibold hover:bg-red-600"
    >
      Logout
    </button>
  );
}