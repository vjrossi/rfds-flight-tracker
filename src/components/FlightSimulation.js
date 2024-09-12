import React, { useState, useEffect, useRef } from 'react';
import generateFlightData from '../generateFlightData';

const FlightSimulation = () => {
  const [simulationState, setSimulationState] = useState({
    flights: generateFlightData(),
    currentTime: null,
    simulationLog: [],
    planesInFlight: 0
  });
  const timerRef = useRef(null);

  useEffect(() => {
    if (simulationState.flights.length > 0 && !simulationState.currentTime) {
      const startTime = new Date(simulationState.flights[0].departureTime);
      startTime.setHours(0, 0, 0, 0); // Start at the beginning of the day
      setSimulationState(prevState => ({ ...prevState, currentTime: startTime }));
    }
  }, [simulationState.flights, simulationState.currentTime]);

  useEffect(() => {
    if (!simulationState.currentTime) return;

    timerRef.current = setInterval(() => {
      setSimulationState(prevState => {
        const newTime = new Date(prevState.currentTime.getTime() + 60000); // Advance by 1 minute
        let newPlanesInFlight = prevState.planesInFlight;
        const newLogs = [];

        // Check for departures and arrivals
        prevState.flights.forEach(flight => {
          const departureTime = new Date(flight.departureTime);
          const arrivalTime = new Date(flight.arrivalTime);
          
          if (departureTime > prevState.currentTime && departureTime <= newTime) {
            newLogs.push(`${departureTime.toLocaleTimeString()} - Flight ${flight.id} departed from ${flight.departureAirport}`);
            newPlanesInFlight++;
          }
          
          if (arrivalTime > prevState.currentTime && arrivalTime <= newTime) {
            newLogs.push(`${arrivalTime.toLocaleTimeString()} - Flight ${flight.id} arrived at ${flight.arrivalAirport}`);
            newPlanesInFlight--;
          }
        });

        // End simulation after 24 hours
        if (newTime.getTime() - prevState.currentTime.getTime() >= 24 * 60 * 60 * 1000) {
          clearInterval(timerRef.current);
        }

        return {
          ...prevState,
          currentTime: newTime,
          simulationLog: [...prevState.simulationLog, ...newLogs],
          planesInFlight: newPlanesInFlight
        };
      });
    }, 100); // Update every 100ms for faster simulation

    return () => clearInterval(timerRef.current);
  }, [simulationState.currentTime]);

  return (
    <div>
      <h2>Flight Simulation</h2>
      <p>Current Time: {simulationState.currentTime ? simulationState.currentTime.toLocaleString() : 'Simulation not started'}</p>
      <p>Planes currently in flight: {simulationState.planesInFlight}</p>
      <div style={{height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px'}}>
        {simulationState.simulationLog.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default FlightSimulation;