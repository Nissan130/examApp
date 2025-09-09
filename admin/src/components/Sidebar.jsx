export default function Sidebar({ setPage }) {
  return (
    <div className="bg-white shadow w-60 min-h-screen p-4">
      <ul className="space-y-3">
        <li>
          <button
            onClick={() => setPage("dashboard")}
            className="w-full text-left p-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => setPage("exams")}
            className="w-full text-left p-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            Manage Exams
          </button>
        </li>
        <li>
          <button
            onClick={() => setPage("questions")}
            className="w-full text-left p-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            Manage Questions
          </button>
        </li>
      </ul>
    </div>
  );
}
