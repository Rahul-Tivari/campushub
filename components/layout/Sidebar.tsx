export default function Sidebar() {
  return (
    <aside className="h-screen w-64 border-r border-gray-800 bg-black p-6 text-white">
      <h2 className="mb-6 text-xl font-bold">
        Dashboard
      </h2>

      <ul className="space-y-4">
        <li className="cursor-pointer hover:text-gray-400 transition">
          Repositories
        </li>

        <li className="cursor-pointer hover:text-gray-400 transition">
          Issues
        </li>

        <li className="cursor-pointer hover:text-gray-400 transition">
          Pull Requests
        </li>

        <li className="cursor-pointer hover:text-gray-400 transition">
          Settings
        </li>
      </ul>
    </aside>
  );
}