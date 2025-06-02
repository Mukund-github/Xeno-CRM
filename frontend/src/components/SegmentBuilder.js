// src/components/SegmentBuilder.js
import React, { useState } from 'react';

const SegmentBuilder = () => {
  const [campaignName, setCampaignName] = useState('Test Campaign');
  const [segments, setSegments] = useState([
    {
      name: 'Delhi over 25',
      rules: [
        { field: 'age', operator: '>', value: 25 },
        { field: 'city', operator: '=', value: 'Delhi' }
      ]
    }
  ]);

  const handleSaveCampaign = async () => {
    try {
      const payload = {
        name: campaignName,
        segments: segments
      };

      const response = await fetch('http://localhost:5000/api/campaign/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Campaign saved successfully!');
        console.log('Saved campaign:', data.campaign);
      } else {
        alert('❌ Failed to save campaign: ' + data.message);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('❌ Error saving campaign');
    }
  };

  return (
    <div>
      <h2>Segment Builder</h2>

      {/* Optional: Make campaign name editable */}
      <input
        type="text"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        placeholder="Campaign Name"
      />

      {/* Future: Add form to manage segments/rules dynamically */}

      <button onClick={handleSaveCampaign}>Save Segment</button>
    </div>
  );
};

export default SegmentBuilder;
