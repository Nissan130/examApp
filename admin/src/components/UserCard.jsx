import React from "react";

export default function UserCard({ user, onDelete, onChangeRole }) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg flex justify-between items-center">
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-700">Role: {user.role}</p>
      </div>
      <div className="flex space-x-2">
        <select
          value={user.role}
          onChange={(e) => onChangeRole(user.id, e.target.value)}
          className="border p-1 rounded"
        >
          <option value="examinee">Examinee</option>
          <option value="examiner">Examiner</option>
        </select>
        <button
          onClick={() => onDelete(user.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
