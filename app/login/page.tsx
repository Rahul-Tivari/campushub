"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const result =
      await signIn(
        "credentials",
        {
          email,
          password,
          redirect: false,
        }
      );

    if (result?.ok) {

      toast.success(
        "Login successful!"
      );

      router.push(
        "/dashboard"
      );

    } else {

      toast.error(
        "Invalid credentials"
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md space-y-4 border border-zinc-800"
      >

        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200"
        >
          Login
        </button>

  <div className="text-center text-zinc-400">

  {"Don't have an account?"}

  <Link
    href="/register"
    className="ml-2 text-cyan-400 hover:text-cyan-300"
  >
    Register
  </Link>

</div>

      </form>

    </div>

  );
}