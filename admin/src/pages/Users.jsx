import React, { useState } from "react";
import UserCard from "../components/UserCard";
import { usersData } from "../data/users";

export default function Users() {
  const [users, setUsers] = useState(usersData);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleChangeRole = (id, newRole) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="pt-20 px-4 md:px-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={handleDelete}
            onChangeRole={handleChangeRole}
          />
        ))}
      </div>
    </div>
  );
}
