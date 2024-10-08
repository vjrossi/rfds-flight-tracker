import React, { useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';

const FlightTable = ({ flightData }) => {
  useEffect(() => {
    console.log("FlightData received in FlightTable:", flightData);
  }, [flightData]);

  const formatDuration = (milliseconds) => {
    if (typeof milliseconds !== 'number' || isNaN(milliseconds)) {
      console.log("Invalid duration:", milliseconds);
      return 'Invalid duration';
    }
    const minutes = Math.floor(milliseconds / 60000);
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