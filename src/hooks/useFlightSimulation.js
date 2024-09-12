// src/hooks/useFlightSimulation.js

import { useState, useEffect, useRef } from 'react';
import generateFlightData from '../generateFlightData';

const useFlightSimulation = () => {
  const [simulationState, setSimulationState] = useState({
    flights: generateFlightData(),
    currentTime: null,
    activeFlights: [],
    planesInFlight: 0,
    simulationLog: []
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
        const newActiveFlights = [];

        // Check for departures and arrivals
        prevState.flights.forEach(flight => {
          const departureTime = new Date(flight.departureTime);
          const arrivalTime = new Date(flight.arrivalTime);
          
          if (departureTime > prevState.currentTime && departureTime <= newTime) {
            newLogs.push(`${departureTime.toLocaleTimeString()} - Flight ${flight.id} departed from ${flight.departureAirport}`);
            newPlanesInFlight++;
            newActiveFlights.push(flight);
          }
          
          if (arrivalTime > prevState.currentTime && arrivalTime <= newTime) {
            newLogs.push(`${arrivalTime.toLocaleTimeString()} - Flight ${flight.id} arrived at ${flight.arrivalAirport}`);
            newPlanesInFlight--;
            const index = newActiveFlights.findIndex(f => f.id === flight.id);
            if (index !== -1) newActiveFlights.splice(index, 1);
          }

          if (departureTime <= newTime && arrivalTime > newTime) {
            newActiveFlights.push(flight);
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
          planesInFlight: newPlanesInFlight,
          activeFlights: newActiveFlights
        };
      });
    }, 100); // Update every 100ms for faster simulation

    return () => clearInterval(timerRef.current);
  }, [simulationState.currentTime]);

  return simulationState;
};

export default useFlightSimulation;