import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuctionList from "./components/AuctionList";
import AuctionDetail from "./components/AuctionDetail";
import CreateAuction from "./components/CreateAuction";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AuctionList />} />
      <Route path="/auction/:id" element={<AuctionDetail />} />
      <Route path="/create" element={<CreateAuction />} />
    </Routes>
  </Router>
);

export default App;
