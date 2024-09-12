import australianAirports from './airportData';

function generateFlightData(startDate = new Date()) {
    const flights = [];
    const totalPlanes = 77;
    const usedPlanes = new Set();
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    // Helper function to generate a skewed random time
    function getSkewedTime(start, end) {
        const skew = Math.pow(Math.random(), 2); // Skew towards earlier times
        return new Date(start.getTime() + skew * (end.getTime() - start.getTime()));
    }

    while (startDate < endDate) {
        // Determine if we should generate a flight (more likely between 6 AM and midnight)
        const hour = startDate.getHours();
        const flightProbability = (hour >= 6 && hour < 24) ? 0.8 : 0.2;

        if (Math.random() < flightProbability && usedPlanes.size < totalPlanes) {
            const departureAirport = australianAirports[Math.floor(Math.random() * australianAirports.length)];
            let arrivalAirport;
            do {
                arrivalAirport = australianAirports[Math.floor(Math.random() * australianAirports.length)];
            } while (arrivalAirport === departureAirport);

            const departureTime = getSkewedTime(startDate, endDate);
            const flightDuration = Math.floor(Math.random() * 90 + 30) * 60 * 1000; // 30 minutes to 2 hours
            const arrivalTime = new Date(departureTime.getTime() + flightDuration);

            if (arrivalTime <= endDate) {
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

                // Move the start time to the arrival time of this flight
                startDate = new Date(arrivalTime.getTime());
            } else {
                // If the flight would end after the 24-hour period, just increment the time
                startDate = new Date(startDate.getTime() + 15 * 60 * 1000); // 15-minute increments
            }
        } else {
            // If no flight is generated, increment the time
            startDate = new Date(startDate.getTime() + 15 * 60 * 1000); // 15-minute increments
        }
    }

    return flights.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
}

export default generateFlightData;