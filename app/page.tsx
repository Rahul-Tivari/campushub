import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
          <button className="rounded-lg bg-white px-6 py-3 text-black font-semibold hover:bg-gray-200 transition">
            Get Started
          </button>

          <button className="rounded-lg border border-gray-700 px-6 py-3 hover:bg-gray-900 transition">
            Learn More
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}