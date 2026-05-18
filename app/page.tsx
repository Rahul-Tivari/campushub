import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="flex h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-6 text-6xl font-bold">
          Welcome to CampusHub
        </h1>

        <p className="max-w-2xl text-lg text-gray-400">
          A GitHub-inspired collaborative development platform
          for academic institutions.
        </p>

        <div className="mt-8 flex gap-4">
          <Button size="lg">
            Get Started
          </Button>

          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}