'use client';
// pages/state-check.tsx (or any component file)
import React from 'react';
import { useStudentStore, useAuthStore } from '@/store/useStore';

const ZustandStateCheck: React.FC = () => {
  const { id, name, age, updateName, updateAge, setStudent } = useStudentStore();
  const { user, token, setUser, logout } = useAuthStore();

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>👨‍🎓 Student Store</h2>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <input
        type="text"
        placeholder="Update name"
        onChange={(e) => updateName(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <input
        type="number"
        placeholder="Update age"
        onChange={(e) => updateAge(parseInt(e.target.value))}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={() => setStudent({ id: 1, name: 'John Doe', age: 22 })}>
        Set Sample Student
      </button>

      <hr style={{ margin: '2rem 0' }} />

      <h2>🔐 Auth Store</h2>
      <p>User: {user ? user.name : 'No user logged in'}</p>
        <p>Email: {user ? user.email : 'No email'}</p>
        <p>ID: {user ? user.id : 'No ID'}</p>
      <p>Token: {token ?? 'No token'}</p>
      <button
        onClick={() =>
          setUser({ id: '101', name: 'Alice', email: 'alice@example.com' }, 'abc123token')
        }
        style={{ marginRight: '1rem' }}
      >
        Set Auth User
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default ZustandStateCheck;
