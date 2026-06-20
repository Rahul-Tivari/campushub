import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (

   <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">

  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

    {/* LEFT SIDE */}

<div className="flex items-center gap-4">

 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 font-black text-white shadow-[0_0_25px_rgba(139,92,246,0.4)]">
  CH
</div>

  <div>

    <h1 className="text-xl font-black tracking-tight">
      CampusHub
    </h1>

    <p className="text-xs text-zinc-500">
      Student Collaboration Platform
    </p>

  </div>

</div>



    {/* RIGHT SIDE */}

    <div className="flex items-center gap-4">

      <Link href="/login">

  <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90">
  Login
</Button>

      </Link>

      <Link href="/register">

  <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90">
  Register
</Button>

      </Link>

    </div>

  </div>

</nav>
  );
}