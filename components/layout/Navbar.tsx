export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-800 bg-black px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          CampusHub
        </h1>

        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-white px-4 py-2 text-black font-medium hover:bg-gray-200 transition">
            Login
          </button>

          <button className="rounded-lg border border-gray-700 px-4 py-2 text-white hover:bg-gray-900 transition">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}