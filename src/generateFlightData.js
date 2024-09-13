import australianAirports from './airportData';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateFlightDuration(distance) {
  const averageSpeed = 500; // km/h, approximate speed of a PC-12
  return distance / averageSpeed; // Duration in hours
}

function generateFlightData() {
  const flights = [];
  const numAttempts = 100; // Increase this if you need more flights
  const baseDate = new Date('2024-09-12T00:00:00Z');

  for (let i = 0; i < numAttempts; i++) {
    const departureAirport = australianAirports[Math.floor(Math.random() * australianAirports.length)];
    let arrivalAirport;
    do {
      arrivalAirport = australianAirports[Math.floor(Math.random() * australianAirports.length)];
    } while (arrivalAirport === departureAirport);

    const distance = calculateDistance(
      departureAirport.lat, departureAirport.lon,
      arrivalAirport.lat, arrivalAirport.lon
    );

    const flightDurationHours = calculateFlightDuration(distance);

    if (flightDurationHours <= 1) {
      const flightDurationMinutes = Math.round(flightDurationHours * 60);
      const departureTime = new Date(baseDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
      const arrivalTime = new Date(departureTime.getTime() + flightDurationMinutes * 60 * 1000);

      const planeId = Math.floor(Math.random() * 10) + 1; // 1 to 10

      flights.push({
        id: `RFDS${planeId}-${flights.length + 1}`,
        departureAirport: departureAirport.iataCode,
        arrivalAirport: arrivalAirport.iataCode,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        aircraft: `PC-12-${planeId}`,
        duration: flightDurationMinutes
      });
    }
  }

  return flights.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
}

export default generateFlightData;