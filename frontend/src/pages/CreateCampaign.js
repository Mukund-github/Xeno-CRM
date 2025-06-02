import React, { useState, useEffect } from "react";

const ruleOptions = [
  { field: "totalSpend", label: "Total Spend (₹)" },
  { field: "visits", label: "Number of Visits" },
  { field: "lastActiveDays", label: "Inactive Days" },
  { field: "name", label: "Customer Name" },
  { field: "age", label: "Customer Age" },
];

const operators = [">", "<", ">=", "<=", "==", "equals"];

export default function CreateCampaign() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading, true/false = status
  const [campaignName, setCampaignName] = useState("Test Campaign");
  const [segmentName, setSegmentName] = useState("Default Segment");
  const [rules, setRules] = useState([
    { field: "totalSpend", operator: ">", value: "", logic: "AND" },
  ]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:5000/auth/user", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(!!data.user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Checking authentication...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p>Please log in to create a campaign.</p>
        </div>
      </div>
    );
  }

  // Logged in - show campaign creation form
  const addRule = () => {
    setRules([
      ...rules,
      { field: "totalSpend", operator: ">", value: "", logic: "AND" },
    ]);
  };

  const updateRule = (index, key, value) => {
    const updatedRules = [...rules];
    updatedRules[index][key] = value;
    setRules(updatedRules);
  };

  const removeRule = (index) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  const handlePreview = async () => {
    const payload = {
      segments: [
        {
          name: segmentName,
          rules: rules.map(({ field, operator, value }) => ({
            field,
            operator,
            value,
          })),
        },
      ],
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/campaign/preview-audience",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        alert("Error previewing audience: " + text);
        return;
      }

      const data = await response.json();
      console.log("Preview response data:", data);

      if (data.audienceSize !== undefined) {
        alert("Audience size: " + data.audienceSize);
      } else {
        alert("Audience size not returned");
      }
    } catch (error) {
      console.error("Preview error:", error);
      alert("Error previewing audience");
    }
  };

  const handleSaveCampaign = async () => {
    const payload = {
      name: campaignName,
      segments: [
        {
          name: segmentName,
          rules: rules.map(({ field, operator, value }) => ({
            field,
            operator,
            value,
          })),
        },
      ],
    };

    try {
      const response = await fetch("http://localhost:5000/api/campaign/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Campaign saved successfully!");
        console.log("Saved campaign:", data.campaign);
      } else {
        alert("Failed to save campaign: " + data.message);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving campaign");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-12 px-4">
      <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
          Create Campaign
        </h2>

        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <input
          type="text"
          placeholder="Segment Name"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          className="w-full mb-8 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <div className="space-y-6">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-3 border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <select
                value={rule.field}
                onChange={(e) => updateRule(index, "field", e.target.value)}
                className="flex-grow sm:flex-grow-0 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
              >
                {ruleOptions.map((opt) => (
                  <option key={opt.field} value={opt.field}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={rule.operator}
                onChange={(e) => updateRule(index, "operator", e.target.value)}
                className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
              >
                {operators.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              {rule.field === "name" ? (
                <input
                  type="text"
                  value={rule.value}
                  placeholder="Enter Name"
                  onChange={(e) => updateRule(index, "value", e.target.value)}
                  className="w-36 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
                />
              ) : (
                <input
                  type="number"
                  value={rule.value}
                  placeholder="Value"
                  onChange={(e) => updateRule(index, "value", e.target.value)}
                  className="w-24 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
                />
              )}

              {index !== 0 && (
                <select
                  value={rule.logic}
                  onChange={(e) => updateRule(index, "logic", e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}

              {index !== 0 && (
                <button
                  onClick={() => removeRule(index)}
                  className="ml-auto bg-red-100 text-red-600 hover:bg-red-200 rounded-xl px-4 py-1 font-semibold transition"
                  aria-label="Remove Rule"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={addRule}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            + Add Rule
          </button>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={handlePreview}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl px-6 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Preview Audience Size
          </button>
          <button
            onClick={handleSaveCampaign}
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Save Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
