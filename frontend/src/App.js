import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampaignDetails from './pages/CampaignDetails';
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import CampaignHistory from './pages/CampaignHistory';
import CampaignList from './pages/CampaignList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/history" element={<CampaignHistory />} />
        <Route path="/campaign/:id" element={<CampaignDetails />} />
        <Route path="/campaigns" element={<CampaignList />} />
      </Routes>
    </Router>
  );
}

export default App;
