import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
  // Fetch campaign details
  fetch(`http://localhost:5000/api/campaign/${id}`, {
    method: 'GET',
    credentials: 'include',  //include cookies for auth
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch campaign details');
      return res.json();
    })
    .then((data) => setCampaign(data))
    .catch((err) => console.error('Failed to fetch campaign details', err));

  // Fetch stats
  fetch(`http://localhost:5000/api/stats/${id}`, {
    method: 'GET',
    credentials: 'include',  //include cookies for auth
  })
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data) => setStats(data))
    .catch((err) => console.error('Failed to fetch campaign stats', err));
}, [id]);


  if (!campaign) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Campaign Details</h1>
      <div className="border rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold">{campaign.name}</h2>
        <p className="text-sm text-gray-500">
          Created: {new Date(campaign.createdAt).toLocaleString()}
        </p>

        <h3 className="mt-4 font-medium">Segments & Rules:</h3>
        {campaign.segments.map((segment, i) => (
          <div key={i} className="pl-4 mb-2">
            <strong>Segment {i + 1}: {segment.name}</strong>
            <ul className="list-disc list-inside">
              {segment.rules.map((rule, j) => (
                <li key={j}>{rule.field} {rule.operator} {rule.value}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Delivery Stats */}
        {stats && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-600">Delivery Stats</h3>
            <ul className="list-disc list-inside text-sm">
              <li>Total Messages: {stats.total}</li>
              <li>Sent: {stats.sent}</li>
              <li>Failed: {stats.failed}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
