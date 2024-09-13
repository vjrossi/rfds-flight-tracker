import React from 'react';

const FlightSimulation = ({ simulationState }) => {
  const { currentTime, simulationLog, planesInFlight } = simulationState;

  return (
    <div>
      <h2>Flight Simulation</h2>
      <p>Current Time: {currentTime ? currentTime.toLocaleString() : 'Simulation not started'}</p>
      <p>Planes currently in flight: {planesInFlight}</p>
      <div style={{height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px'}}>
        {simulationLog.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default FlightSimulation;