import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FlightTable from './components/FlightTable';
import FlightSimulation from './components/FlightSimulation';
import FlightMap from './components/FlightMap';
import generateFlightData from './generateFlightData';
import useFlightSimulation from './hooks/useFlightSimulation';

function App() {
  const [flightData, setFlightData] = useState(null);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const simulationState = useFlightSimulation(flightData, isSimulationStarted);

  const handleGenerateData = () => {
    setFlightData(generateFlightData());
  };

  const handleStartSimulation = () => {
    if (flightData) {
      setIsSimulationStarted(true);
    } else {
      alert("Please generate flight data first.");
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div style={{ margin: '20px' }}>
          <button onClick={handleGenerateData}>
            Generate Flight Data
          </button>
          <button onClick={handleStartSimulation} disabled={!flightData || isSimulationStarted} style={{ marginLeft: '10px' }}>
            Start Simulation
          </button>
        </div>
        <Routes>
          <Route path="/" element={<FlightTable flightData={flightData} />} />
          <Route path="/simulation" element={<FlightSimulation simulationState={simulationState} />} />
          <Route path="/map" element={<FlightMap simulationState={simulationState} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;