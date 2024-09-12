import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FlightTable from './components/FlightTable';
import FlightSimulation from './components/FlightSimulation';
import FlightMap from './components/FlightMap';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<FlightTable />} />
          <Route path="/simulation" element={<FlightSimulation />} />
          <Route path="/map" element={<FlightMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;