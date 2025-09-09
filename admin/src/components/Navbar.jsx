import React from "react";

export default function Navbar({ adminName }) {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow p-4 px-6 flex justify-between items-center text-white fixed top-0 w-full z-50">
      <h1 className="font-bold text-xl">Admin Panel</h1>
      <p>Welcome, {adminName}</p>
    </nav>
  );
}
