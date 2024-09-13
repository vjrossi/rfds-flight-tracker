import React from 'react';
import { Table, Container } from 'react-bootstrap';

const FlightTable = ({ flightData }) => {
  console.log("FlightData received in FlightTable:", flightData); // Add this line for debugging

  const formatDuration = (minutes) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) {
      console.log("Invalid duration:", minutes); // Debugging line
      return 'Invalid duration';
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Container>
      <h1 className="my-4">RFDS Flight Schedule</h1>
      {flightData && flightData.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Flight ID</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Aircraft</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {flightData.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.id}</td>
                <td>{`${flight.departureAirport} - ${new Date(flight.departureTime).toLocaleString()}`}</td>
                <td>{`${flight.arrivalAirport} - ${new Date(flight.arrivalTime).toLocaleString()}`}</td>
                <td>{flight.aircraft}</td>
                <td>{formatDuration(flight.duration)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No flight data available. Click "Start Simulation" to generate flight data.</p>
      )}
    </Container>
  );
};

export default FlightTable;