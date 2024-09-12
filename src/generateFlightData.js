import australianAirports from './airportData';

function generateFlightData() {
  const flights = [];
  const totalPlanes = 77;
  const usedPlanes = new Set();

  // Set the date to yesterday
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  startDate.setHours(0, 0, 0, 0); // Set to start of yesterday

  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1); // Set to end of yesterday

  const targetFlights = 13 + Math.floor(Math.random() * 5); // 13 to 17 flights

  function getSkewedTime(start, end) {
    const skew = Math.pow(Math.random(), 1.5);
    return new Date(start.getTime() + skew * (end.getTime() - start.getTime()));
  }

  for (let i = 0; i < targetFlights; i++) {
    let departureTime;
    do {
      departureTime = getSkewedTime(startDate, endDate);
    } while (departureTime.getHours() >= 0 && departureTime.getHours() < 12 && Math.random() > 0.3);

    const departureAirport = australianAirports[Math.floor(Math.random() * australianAirports.length)];
    let arrivalAirport;
    do {
      arrivalAirport = australianAirports[Math.floor(Math.random() * australianAirports.length)];
    } while (arrivalAirport === departureAirport);

    const maxFlightDuration = Math.min(120, (endDate.getTime() - departureTime.getTime()) / (60 * 1000));
    const flightDuration = Math.floor(Math.random() * (maxFlightDuration - 30) + 30) * 60 * 1000; // 30 minutes to maxFlightDuration or 2 hours, whichever is less
    const arrivalTime = new Date(departureTime.getTime() + flightDuration);

    if (arrivalTime > endDate) {
      continue; // Skip this flight if it would end after the day
    }

    const planeId = Math.floor(Math.random() * totalPlanes) + 1;
    usedPlanes.add(planeId);

    flights.push({
      id: `RFDS${planeId}-${flights.length + 1}`,
      departureAirport: departureAirport.iataCode,
      arrivalAirport: arrivalAirport.iataCode,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      aircraft: `PC-12-${planeId}`,
    });
  }

  const sortedFlights = flights.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));

  console.log("\nSorted Flights (for yesterday):");
  sortedFlights.forEach((flight, index) => {
    console.log(`${index + 1}. ${flight.id} | ${flight.departureAirport} -> ${flight.arrivalAirport} | Departure: ${new Date(flight.departureTime).toLocaleString()} | Arrival: ${new Date(flight.arrivalTime).toLocaleString()}`);
  });

  return sortedFlights;
}

export default generateFlightData;