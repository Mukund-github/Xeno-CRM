import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ClockIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user on mount
    axios.get('http://localhost:5000/auth/user', { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:5000/auth/logout', { withCredentials: true })
      .then(() => setUser(null))
      .catch(() => setUser(null));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md sm:max-w-lg md:max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-3">Xeno Mini CRM</h1>
        <p className="text-gray-600 mb-8">Manage and track your marketing campaigns effectively.</p>

        {!user ? (
          <a
            href="http://localhost:5000/auth/google"
            className="inline-block mb-6 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-2xl text-lg font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Login with Google
          </a>
        ) : (
          <div className="mb-6">
            <p className="mb-4 text-gray-700">Welcome, <strong>{user.displayName || user.name?.givenName || 'User'}</strong>!</p>
            <button
              onClick={handleLogout}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-5 rounded-lg font-semibold transition duration-300"
            >
              Logout
            </button>
          </div>
        )}

        <nav className="space-y-5">
          <Link
            to="/create"
            className={`flex items-center justify-center gap-3 w-full py-3 px-6 rounded-2xl text-lg font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
              user ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-700'
            }`}
            tabIndex={user ? 0 : -1}
            aria-disabled={!user}
          >
            <PlusIcon className="h-6 w-6" />
            Create Campaign
          </Link>
          <Link
            to="/history"
            className={`flex items-center justify-center gap-3 w-full py-3 px-6 rounded-2xl text-lg font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
              user ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-400 cursor-not-allowed text-gray-700'
            }`}
            tabIndex={user ? 0 : -1}
            aria-disabled={!user}
          >
            <ClockIcon className="h-6 w-6" />
            Campaign History
          </Link>
        </nav>
      </div>
    </div>
  );
}
