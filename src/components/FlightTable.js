import React from 'react';
import { Table, Container } from 'react-bootstrap';

const FlightTable = ({ flightData }) => {
  return (
    <Container>
      <h1 className="my-4">RFDS Flight Schedule</h1>
      {flightData ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Flight ID</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Aircraft</th>
            </tr>
          </thead>
          <tbody>
            {flightData.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.id}</td>
                <td>{`${flight.departureAirport} - ${new Date(flight.departureTime).toLocaleString()}`}</td>
                <td>{`${flight.arrivalAirport} - ${new Date(flight.arrivalTime).toLocaleString()}`}</td>
                <td>{flight.aircraft}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Click "Start Simulation" to generate flight data.</p>
      )}
    </Container>
  );
};

export default FlightTable;