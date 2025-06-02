import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("/api/campaign/list");
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <p className="text-center">Loading campaigns...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Campaign List</h1>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="space-y-4">
          {campaigns.map((campaign) => (
            <li key={campaign._id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{campaign.name}</h2>
              <p className="text-sm text-gray-600">
                Created on: {new Date(campaign.createdAt).toLocaleString()}
              </p>
              <Link
                to={`/campaign/${campaign._id}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampaignList;
