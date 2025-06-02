import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCampaigns = () => {
  setLoading(true);
  setError(null);
  fetch('http://localhost:5000/api/campaign/list', {
    method: 'GET',
    credentials: 'include', //Including cookies for session auth
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Unauthorized or failed request');
      }
      return res.json();
    })
    .then((data) => {
      setCampaigns(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Failed to fetch campaigns', err);
      setError('Failed to fetch campaigns');
      setLoading(false);
    });
};

  useEffect(() => {
    fetchCampaigns();
  }, []);

  //clearing history
  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all campaign history?')) return;

    try {
      const res = await fetch('http://localhost:5000/api/campaign/clear', { method: 'DELETE' });
      if (res.ok) {
        setCampaigns([]);
        alert('Campaign history cleared!');
      } else {
        alert('Failed to clear campaign history.');
      }
    } catch (err) {
      alert('Error clearing history');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
            <span role="img" aria-label="scroll"></span> Campaign History
          </h2>
          <button
            onClick={clearHistory}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition duration-300"
          >
            Clear History
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading campaigns...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && campaigns.length === 0 && (
          <p className="text-gray-600 text-center">No campaigns found.</p>
        )}

        <ul className="space-y-6">
          {campaigns.map((c) => (
            <Link to={`/campaign/${c._id}`} key={c._id}>
              <li className="border border-gray-300 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-xl text-gray-800">{c.name}</strong>
                  <small className="text-gray-500 text-sm">
                    {new Date(c.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="mb-2 text-gray-600 italic">
                  {c.segments.reduce((total, segment) => total + segment.rules.length, 0)} rule
                  {c.segments.reduce((total, segment) => total + segment.rules.length, 0) !== 1 ? 's' : ''}
                </div>

                <div className="flex gap-4 text-sm mb-2">
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                    Sent: 0
                  </span>
                  <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full font-semibold">
                    Failed: 0
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
                    Audience Size: 0
                  </span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
