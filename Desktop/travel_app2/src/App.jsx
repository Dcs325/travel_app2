import React, { useState, useEffect } from 'react';
import hotelRates from './data/hotelRates';
import touristSights from './data/touristSights';
import airports from './data/airports';
import funActivities from './data/funActivities';

// List of 50 US States for dropdowns
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
].sort(); // Sort alphabetically for easier selection

// Simulated cost profiles based on travel style (except hotelPerNightPerRoom, now dynamic)
const costProfiles = {
  Budget: {
    baseAirfare: 150, // Base cost for a short flight
    longDistanceAirfareAddon: 100, // Add-on for longer flights (simulated)
    foodPerDayPerPerson: 50, // Cost for food per person per day
    localTransportPerDayPerPerson: 25, // Cost for local transport (e.g., rental car, public transport)
    activitiesPerDayPerPerson: 40, // Cost for activities/entertainment
  },
  Standard: {
    baseAirfare: 250,
    longDistanceAirfareAddon: 200,
    foodPerDayPerPerson: 80,
    localTransportPerDayPerPerson: 40,
    activitiesPerDayPerPerson: 70,
  },
  Premium: {
    baseAirfare: 400,
    longDistanceAirfareAddon: 300,
    foodPerDayPerPerson: 120,
    localTransportPerDayPerPerson: 70,
    activitiesPerDayPerPerson: 120,
  },
};

const MAPBOX_TOKEN = "pk.eyJ1IjoiZGFudmVzdGVyODAiLCJhIjoiY21jdGlwZDFkMDVnYTJrcTI3YjRmdWlybSJ9.1NWb0z29be-B2Jx-zebCvQ";

// State capitals as fallback coordinates for attractions
const stateCapitals = {
  Alabama: { lat: 32.3777, lng: -86.3000 },
  Alaska: { lat: 58.3019, lng: -134.4197 },
  Arizona: { lat: 33.4484, lng: -112.0740 },
  Arkansas: { lat: 34.7465, lng: -92.2896 },
  California: { lat: 38.5758, lng: -121.4789 },
  Colorado: { lat: 39.7392, lng: -104.9903 },
  Connecticut: { lat: 41.7640, lng: -72.6822 },
  Delaware: { lat: 39.1582, lng: -75.5244 },
  Florida: { lat: 30.4383, lng: -84.2807 },
  Georgia: { lat: 33.7490, lng: -84.3880 },
  Hawaii: { lat: 21.3070, lng: -157.8584 },
  Idaho: { lat: 43.6150, lng: -116.2023 },
  Illinois: { lat: 39.7983, lng: -89.6544 },
  Indiana: { lat: 39.7684, lng: -86.1581 },
  Iowa: { lat: 41.5911, lng: -93.6037 },
  Kansas: { lat: 39.0489, lng: -95.6778 },
  Kentucky: { lat: 38.2009, lng: -84.8733 },
  Louisiana: { lat: 30.4515, lng: -91.1871 },
  Maine: { lat: 44.3072, lng: -69.7817 },
  Maryland: { lat: 38.9784, lng: -76.4922 },
  Massachusetts: { lat: 42.3601, lng: -71.0589 },
  Michigan: { lat: 42.7336, lng: -84.5553 },
  Minnesota: { lat: 44.9537, lng: -93.0900 },
  Mississippi: { lat: 32.2988, lng: -90.1848 },
  Missouri: { lat: 38.5791, lng: -92.1729 },
  Montana: { lat: 46.5857, lng: -112.0184 },
  Nebraska: { lat: 40.8136, lng: -96.7026 },
  Nevada: { lat: 39.1638, lng: -119.7674 },
  "New Hampshire": { lat: 43.2081, lng: -71.5376 },
  "New Jersey": { lat: 40.2206, lng: -74.7699 },
  "New Mexico": { lat: 35.6870, lng: -105.9378 },
  "New York": { lat: 42.6526, lng: -73.7562 },
  "North Carolina": { lat: 35.7804, lng: -78.6391 },
  "North Dakota": { lat: 46.8083, lng: -100.7837 },
  Ohio: { lat: 39.9612, lng: -82.9988 },
  Oklahoma: { lat: 35.4634, lng: -97.5151 },
  Oregon: { lat: 44.9429, lng: -123.0351 },
  Pennsylvania: { lat: 40.2732, lng: -76.8867 },
  "Rhode Island": { lat: 41.8236, lng: -71.4222 },
  "South Carolina": { lat: 34.0007, lng: -81.0348 },
  "South Dakota": { lat: 44.3670, lng: -100.3464 },
  Tennessee: { lat: 36.1627, lng: -86.7816 },
  Texas: { lat: 30.2747, lng: -97.7404 },
  Utah: { lat: 40.7608, lng: -111.8910 },
  Vermont: { lat: 44.2601, lng: -72.5754 },
  Virginia: { lat: 37.5407, lng: -77.4360 },
  Washington: { lat: 47.0379, lng: -122.9007 },
  "West Virginia": { lat: 38.3498, lng: -81.6326 },
  Wisconsin: { lat: 43.0747, lng: -89.3842 },
  Wyoming: { lat: 41.1400, lng: -104.8202 },
};

function App() {
  const [originState, setOriginState] = useState('');
  const [destinationState, setDestinationState] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numDays, setNumDays] = useState(1);
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelStyle, setTravelStyle] = useState('Standard'); // New state for travel style
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [error, setError] = useState('');
  const [tripInfo, setTripInfo] = useState(null);
  const [showAttractionsModal, setShowAttractionsModal] = useState(false);
  const [modalAttractions, setModalAttractions] = useState([]);
  const [modalState, setModalState] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [attractionCoords, setAttractionCoords] = useState(null);
  const [directions, setDirections] = useState([]);
  const [travelMode, setTravelMode] = useState('drive'); // 'drive' or 'fly'
  const [nearestAirport, setNearestAirport] = useState(null);
  const [flightEstimate, setFlightEstimate] = useState(null);
  const [flightResults, setFlightResults] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightApiError, setFlightApiError] = useState(null);
  const [flightDebug, setFlightDebug] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [manualAirportSelection, setManualAirportSelection] = useState(null);
  const [showManualAirportSelect, setShowManualAirportSelect] = useState(false);
  const [originAddress, setOriginAddress] = useState('');
  const [originAddressCoords, setOriginAddressCoords] = useState(null);
  const [originAddressStatus, setOriginAddressStatus] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationAddressCoords, setDestinationAddressCoords] = useState(null);
  const [destinationAddressStatus, setDestinationAddressStatus] = useState('');
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState('');
  const [showHotels, setShowHotels] = useState(false); // New state for hotel list visibility

  const DEFAULT_GAS_PRICE = 3.5; // dollars per gallon
  const DEFAULT_MPG = 25; // miles per gallon
  const AVIATIONSTACK_KEY = "2e0fe3c943d19a28d53f2628ea78b3dc";

  const getStateKey = (state) => {
    // Normalize state name for data lookup (e.g., "New York" -> "NewYork")
    return state.replace(/\s/g, '');
  };

  // For all calculations, use originAddressCoords if set, otherwise userLocation.
  const effectiveUserLocation = originAddressCoords || userLocation;
  // For all calculations, use destinationAddressCoords if set, otherwise attractionCoords.
  const effectiveDestinationCoords = destinationAddressCoords || attractionCoords;

  // Move fetchHotelsAuto out of useEffect so it can be called directly
  async function fetchHotelsAuto(coords, destinationState) {
    setHotels([]);
    setHotelsError('');
    setHotelsLoading(true);
    if (!coords) {
      setHotelsError('No destination coordinates available.');
      setHotelsLoading(false);
      return;
    }
    const query = 'hotel';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${coords.lng},${coords.lat}&bbox=${US_BBOX.join(',')}&limit=10&access_token=${MAPBOX_TOKEN}`;
    console.log('Hotel search debug:', { coords, query, url });
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log('Hotel search response:', data);
      if (data.features && data.features.length > 0) {
        setHotels(data.features);
        console.log('All returned features:', data.features);
      } else {
        setHotelsError('No hotels found nearby.');
      }
    } catch (err) {
      setHotelsError('Error fetching hotels.');
      console.error('Hotel search error:', err);
    }
    setHotelsLoading(false);
  }

  // Update useEffect to call fetchHotelsAuto only if needed
  useEffect(() => {
    if (selectedAttraction && effectiveDestinationCoords) {
      fetchHotelsAuto(effectiveDestinationCoords, destinationState);
    }
  }, [selectedAttraction, effectiveDestinationCoords, destinationState]);

  // Update calculateEstimate to trigger both hotel and flight fetches
  const calculateEstimate = () => {
    setError(''); // Clear previous errors
    setTripInfo(null);

    if (!originState || !destinationState || numDays <= 0 || numTravelers <= 0 || !travelStyle) {
      setError('Please fill in all fields and ensure values are positive.');
      setEstimatedCost(null);
      setCostBreakdown(null);
      return;
    }

    if (originState === destinationState && numDays > 1) {
      setError('For same-state travel, please select 1 day or different states for multi-day trips.');
      setEstimatedCost(null);
      setCostBreakdown(null);
      return;
    }

    const currentCosts = costProfiles[travelStyle];
    const destKey = getStateKey(destinationState);

    // Use hotel rate from data, fallback to Standard if not found
    const hotelRate = hotelRates[destKey] || 180;
    const numRooms = Math.ceil(numTravelers / 2);
    const hotelCost = numRooms * numDays * hotelRate;

    // Airfare: Base + a simulated "long distance" factor if states are different
    let airfareCost = numTravelers * currentCosts.baseAirfare;
    if (originState !== destinationState) {
      airfareCost += numTravelers * currentCosts.longDistanceAirfareAddon; // Simulate longer flight cost
    }

    // Food: Per person per day
    const foodCost = numTravelers * numDays * currentCosts.foodPerDayPerPerson;

    // Local Transport: Per person per day (includes airport transfers, local travel)
    const localTransportCost = numTravelers * numDays * currentCosts.localTransportPerDayPerPerson;

    // Activities: Per person per day
    const activitiesCost = numTravelers * numDays * currentCosts.activitiesPerDayPerPerson;

    const totalSum = airfareCost + hotelCost + foodCost + localTransportCost + activitiesCost;

    setEstimatedCost(totalSum);
    setCostBreakdown({
      airfare: airfareCost,
      hotel: hotelCost,
      food: foodCost,
      localTransport: localTransportCost,
      activities: activitiesCost
    });

    // Gather trip info for display
    setTripInfo({
      sights: touristSights[destKey] || [],
      airport: airports[destKey] || null,
      activities: funActivities[destKey] || [],
      hotelRate,
    });

    // Set the selected attraction to the first available if not already set
    if (!selectedAttraction && (touristSights[destKey] && touristSights[destKey].length > 0)) {
      setSelectedAttraction(touristSights[destKey][0]);
    }

    // Trigger hotel search
    if (effectiveDestinationCoords) {
      fetchHotelsAuto(effectiveDestinationCoords, destinationState);
    }

    // Trigger flight calculation by setting travel mode to 'fly'
    setTravelMode('fly');
  };

  // Remove modal logic from handleDestinationClick
  const handleDestinationChange = (e) => {
    setDestinationState(e.target.value);
  };

  // New function to open modal
  const handleViewAttractions = () => {
    if (destinationState) {
      const destKey = getStateKey(destinationState);
      const attractions = touristSights[destKey] || touristSights[destinationState] || [];
      if (attractions.length >= 5) {
        setModalAttractions(attractions.slice(0, 5));
      } else {
        setModalAttractions([...(attractions || []), ...Array(5 - (attractions ? attractions.length : 0)).fill('Attraction coming soon!')]);
      }
      setModalState(destinationState);
      setShowAttractionsModal(true);
    }
  };

  const handleSelectAttraction = (attraction) => {
    setSelectedAttraction(attraction);
    setShowAttractionsModal(false);
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGeoError(null);
          setShowManualAirportSelect(false);
        },
        (error) => {
          setGeoError('Unable to retrieve your location. Please select your nearest airport manually.');
          setShowManualAirportSelect(true);
        }
      );
    } else {
      setGeoError('Geolocation is not supported by your browser. Please select your nearest airport manually.');
      setShowManualAirportSelect(true);
    }
  };

  // Geocode attraction when selected
  useEffect(() => {
    async function geocodeAttraction() {
      if (selectedAttraction && destinationState) {
        const query = encodeURIComponent(`${selectedAttraction}, ${destinationState}, USA`);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            setAttractionCoords({ lat, lng });
          } else {
            // fallback to state capital
            const cap = stateCapitals[destinationState];
            setAttractionCoords(cap);
          }
        } catch (err) {
          setAttractionCoords(stateCapitals[destinationState]);
        }
      } else {
        setAttractionCoords(null);
      }
    }
    geocodeAttraction();
  }, [selectedAttraction, destinationState]);

  // Fetch route from user location to attraction coordinates
  useEffect(() => {
    async function fetchRoute() {
      if (effectiveUserLocation && effectiveDestinationCoords) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${effectiveUserLocation.lng},${effectiveUserLocation.lat};${effectiveDestinationCoords.lng},${effectiveDestinationCoords.lat}?geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            setRouteInfo({
              distance: route.distance / 1000, // km
              distanceMiles: route.distance / 1609.34, // miles
              duration: route.duration / 60, // min
              geometry: route.geometry,
              arrival: new Date(Date.now() + route.duration * 1000),
            });
            setRouteError(null);
            // Step-by-step directions
            if (route.legs && route.legs[0] && route.legs[0].steps) {
              setDirections(route.legs[0].steps.map(step => step.maneuver.instruction));
            } else {
              setDirections([]);
            }
          } else {
            setRouteError('No route found.');
            setRouteInfo(null);
            setDirections([]);
          }
        } catch (err) {
          setRouteError('Error fetching route.');
          setRouteInfo(null);
          setDirections([]);
        }
      }
    }
    fetchRoute();
  }, [effectiveUserLocation, effectiveDestinationCoords]);

  // Find nearest airport to user location (by actual distance, not state)
  useEffect(() => {
    if (travelMode === 'fly') {
      if (effectiveUserLocation) {
        let minDist = Infinity;
        let nearest = null;
        const toRad = (x) => x * Math.PI / 180;
        const haversine = (lat1, lon1, lat2, lon2) => {
          const R = 6371; // km
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };
        Object.values(airports).forEach((airport) => {
          if (airport.cityLat && airport.cityLng) {
            const d = haversine(effectiveUserLocation.lat, effectiveUserLocation.lng, airport.cityLat, airport.cityLng);
            if (d < minDist) {
              minDist = d;
              nearest = airport;
            }
          }
        });
        setNearestAirport(nearest);
      } else if (manualAirportSelection) {
        setNearestAirport(manualAirportSelection);
      } else {
        setNearestAirport(null);
      }
    } else {
      setNearestAirport(null);
    }
  }, [effectiveUserLocation, travelMode, manualAirportSelection]);

  // Estimate flight info (simulated)
  useEffect(() => {
    if (travelMode === 'fly' && nearestAirport && destinationState && airports[getStateKey(destinationState)]) {
      // Simulate flight duration and price
      const destAirport = airports[getStateKey(destinationState)];
      // Haversine formula for distance
      function toRad(x) { return x * Math.PI / 180; }
      function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }
      const distKm = haversine(
        nearestAirport.cityLat || 0, nearestAirport.cityLng || 0,
        destAirport.cityLat || 0, destAirport.cityLng || 0
      );
      // Simulate: 800km/h avg speed, $0.18/km
      const durationHr = distKm / 800;
      const price = distKm * 0.18;
      setFlightEstimate({
        from: nearestAirport,
        to: destAirport,
        distance: distKm,
        duration: durationHr * 60, // min
        price
      });
    } else {
      setFlightEstimate(null);
    }
  }, [travelMode, nearestAirport, destinationState]);

  // Fetch real-time flights from Aviationstack when fly mode and airports are set
  useEffect(() => {
    async function fetchFlights() {
      if (
        travelMode === 'fly' &&
        nearestAirport &&
        destinationState &&
        airports[getStateKey(destinationState)] &&
        nearestAirport.code &&
        airports[getStateKey(destinationState)].code
      ) {
        setFlightLoading(true);
        setFlightApiError(null);
        setFlightResults([]);
        setFlightDebug('Requesting flights...');
        const dep = nearestAirport.code;
        const arr = airports[getStateKey(destinationState)].code;
        const url = `http://localhost:5001/aviationstack?dep_iata=${dep}&arr_iata=${arr}&limit=5`;
        try {
          setFlightDebug(`Fetching: ${url}`);
          const res = await fetch(url);
          const data = await res.json();
          setFlightDebug({ url, data });
          if (data.data && data.data.length > 0) {
            setFlightResults(data.data);
          } else {
            setFlightApiError('No real-time flights found for this route.');
          }
        } catch (err) {
          setFlightApiError('Error fetching flight data.');
          setFlightDebug({ url, error: err.message });
        }
        setFlightLoading(false);
      } else {
        setFlightResults([]);
        setFlightApiError(null);
        setFlightDebug(null);
      }
    }
    fetchFlights();
  }, [travelMode, nearestAirport, destinationState]);

  // US bounding box: [west, south, east, north]
  const US_BBOX = [-125, 24, -66, 50];

  // 1. Always show Drive/Fly toggle after attraction is selected (unless both locations are missing)
  // 2. Auto-fetch hotels after selecting an attraction or calculating trip
  useEffect(() => {
    async function fetchHotelsAuto() {
      setHotels([]);
      setHotelsError('');
      setHotelsLoading(true);
      const coords = effectiveDestinationCoords;
      if (!coords) {
        setHotelsError('No destination coordinates available.');
        setHotelsLoading(false);
        return;
      }
      // Use just 'hotel' as the query for best results, and remove types=poi
      const query = 'hotel';
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${coords.lng},${coords.lat}&limit=10&access_token=${MAPBOX_TOKEN}`;
      console.log('Hotel search debug:', { coords, query, url });
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('Hotel search response:', data);
        if (data.features && data.features.length > 0) {
          // Loosen filtering: show all features returned by Mapbox
          setHotels(data.features);
          console.log('All returned features:', data.features);
        } else {
          setHotelsError('No hotels found nearby.');
        }
      } catch (err) {
        setHotelsError('Error fetching hotels.');
        console.error('Hotel search error:', err);
      }
      setHotelsLoading(false);
    }
    if (selectedAttraction && effectiveDestinationCoords) {
      fetchHotelsAuto();
    }
  }, [selectedAttraction, effectiveDestinationCoords, destinationState]);

  return (
    <div className="min-h-screen min-w-full bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-0 font-sans">
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-200 mx-auto my-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            US Travel Cost Estimator
          </h1>

          <div className="space-y-4">
            {/* Origin Address Field */}
            <div>
              <label htmlFor="originAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Origin Street Address (optional):
              </label>
              <input
                id="originAddress"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="123 Main St, City, State"
                value={originAddress}
                onChange={e => setOriginAddress(e.target.value)}
                onBlur={async () => {
                  if (originAddress.trim() === '') {
                    setOriginAddressCoords(null);
                    setOriginAddressStatus('');
                    return;
                  }
                  setOriginAddressStatus('Geocoding...');
                  try {
                    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(originAddress)}.json?access_token=${MAPBOX_TOKEN}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data.features && data.features.length > 0) {
                      const [lng, lat] = data.features[0].center;
                      setOriginAddressCoords({ lat, lng });
                      setOriginAddressStatus('');
                    } else {
                      setOriginAddressCoords(null);
                      setOriginAddressStatus('Address not found.');
                    }
                  } catch (err) {
                    setOriginAddressCoords(null);
                    setOriginAddressStatus('Error geocoding address.');
                  }
                }}
              />
              {originAddressStatus && <div className="text-xs text-gray-500 mt-1">{originAddressStatus}</div>}
            </div>

            {/* Destination Address Field */}
            <div>
              <label htmlFor="destinationAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Destination Street Address (optional):
              </label>
              <input
                id="destinationAddress"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="456 Elm St, City, State"
                value={destinationAddress}
                onChange={e => setDestinationAddress(e.target.value)}
                onBlur={async () => {
                  if (destinationAddress.trim() === '') {
                    setDestinationAddressCoords(null);
                    setDestinationAddressStatus('');
                    return;
                  }
                  setDestinationAddressStatus('Geocoding...');
                  try {
                    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationAddress)}.json?access_token=${MAPBOX_TOKEN}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data.features && data.features.length > 0) {
                      const [lng, lat] = data.features[0].center;
                      setDestinationAddressCoords({ lat, lng });
                      setDestinationAddressStatus('');
                    } else {
                      setDestinationAddressCoords(null);
                      setDestinationAddressStatus('Address not found.');
                    }
                  } catch (err) {
                    setDestinationAddressCoords(null);
                    setDestinationAddressStatus('Error geocoding address.');
                  }
                }}
              />
              {destinationAddressStatus && <div className="text-xs text-gray-500 mt-1">{destinationAddressStatus}</div>}
            </div>

            {/* Origin State and Destination State on the same line */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="originState" className="block text-sm font-medium text-gray-700 mb-1">
                  Origin State:
                </label>
                <select
                  id="originState"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                  value={originState}
                  onChange={(e) => setOriginState(e.target.value)}
                >
                  <option value="">Select a state</option>
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="destinationState" className="block text-sm font-medium text-gray-700 mb-1">
                  Destination State:
                </label>
                <select
                  id="destinationState"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                  value={destinationState}
                  onChange={handleDestinationChange}
                >
                  <option value="">Select a state</option>
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {/* View Attractions Button */}
                {destinationState && (
                  <button
                    type="button"
                    className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    onClick={handleViewAttractions}
                  >
                    View Attractions
                  </button>
                )}
              </div>
            </div>

            {/* Number of Days (Date Range Picker) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Dates:
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={startDate}
                  onChange={e => {
                    setStartDate(e.target.value);
                    if (endDate && e.target.value) {
                      const start = new Date(e.target.value);
                      const end = new Date(endDate);
                      const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
                      setNumDays(diff);
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
                <span className="mx-1">to</span>
                <input
                  type="date"
                  className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={endDate}
                  onChange={e => {
                    setEndDate(e.target.value);
                    if (startDate && e.target.value) {
                      const start = new Date(startDate);
                      const end = new Date(e.target.value);
                      const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
                      setNumDays(diff);
                    }
                  }}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              {startDate && endDate && (
                <div className="text-xs text-gray-600 mt-1">
                  {`Trip length: ${numDays} day${numDays > 1 ? 's' : ''} (${startDate} to ${endDate})`}
                </div>
              )}
            </div>

            {/* Number of Travelers and Travel Style on the same line */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="numTravelers" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Travelers:
                </label>
                <input
                  type="number"
                  id="numTravelers"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={numTravelers}
                  onChange={(e) => setNumTravelers(Math.max(1, parseInt(e.target.value) || 1))} // Ensure minimum 1 traveler
                  min="1"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="travelStyle" className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Style:
                </label>
                <select
                  id="travelStyle"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Calculate Button */}
            <button
              onClick={calculateEstimate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Calculate Estimated Cost
            </button>
          </div>

          {/* Attractions Modal */}
          {showAttractionsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                  onClick={() => setShowAttractionsModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Top Attractions in {modalState}</h2>
                <ul className="list-disc ml-6 space-y-2">
                  {modalAttractions.map((attraction, idx) => (
                    <li key={idx}>
                      <button
                        className="w-full text-left px-2 py-1 rounded hover:bg-blue-100 focus:bg-blue-200 focus:outline-none"
                        onClick={() => handleSelectAttraction(attraction)}
                      >
                        {attraction}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Results Display */}
          {estimatedCost !== null && costBreakdown && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Estimated Trip Cost:
              </h2>
              <p className="text-4xl font-extrabold text-blue-700 text-center mb-6">
                ${estimatedCost.toLocaleString()}
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Cost Breakdown:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="font-medium">Airfare:</span>
                  <span>${costBreakdown.airfare.toLocaleString()}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="font-medium">Hotel:</span>
                  <span>${costBreakdown.hotel.toLocaleString()}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="font-medium">Food:</span>
                  <span>${costBreakdown.food.toLocaleString()}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="font-medium">Local Transport:</span>
                  <span>${costBreakdown.localTransport.toLocaleString()}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="font-medium">Activities:</span>
                  <span>${costBreakdown.activities.toLocaleString()}</span>
                </li>
              </ul>

              {/* Extra Info Section */}
              {tripInfo && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Destination Highlights</h3>
                  {/* Airport Info */}
                  {tripInfo.airport && (
                    <div className="mb-4">
                      <span className="font-medium">Main Airport:</span> {tripInfo.airport.name} ({tripInfo.airport.code}) - {tripInfo.airport.city}
                    </div>
                  )}
                  {/* Hotel Rate */}
                  <div className="mb-4">
                    <span className="font-medium">Hotel Rate (per night, per room):</span> ${tripInfo.hotelRate}
                  </div>
                  {/* Tourist Sights */}
                  {tripInfo.sights.length > 0 && (
                    <div className="mb-4">
                      <span className="font-medium">Top Tourist Sights:</span>
                      <ul className="list-disc ml-6 mt-1">
                        {tripInfo.sights.map((sight, idx) => (
                          <li key={idx}>{sight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Fun Activities */}
                  {tripInfo.activities.length > 0 && (
                    <div className="mb-4">
                      <span className="font-medium">Fun Activities:</span>
                      <ul className="list-disc ml-6 mt-1">
                        {tripInfo.activities.map((activity, idx) => (
                          <li key={idx}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <p className="mt-6 text-sm text-gray-500 text-center italic">
                *Note: These are simulated estimates for demonstration purposes only and do not reflect real-time market prices or specific travel conditions.
              </p>
            </div>
          )}

          {/* Selected Attraction and Route/Price Info */}
          {selectedAttraction && (effectiveUserLocation || effectiveDestinationCoords) && (
            <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-2">Your Selected Attraction</h3>
              <p className="mb-2">{selectedAttraction}</p>
              {/* Travel Mode Toggle - always visible when an attraction is selected */}
              <div className="flex gap-4 mb-6 justify-center items-center">
                <span className="font-semibold text-gray-700">Travel Mode:</span>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold border transition ${travelMode === 'drive' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
                  onClick={() => setTravelMode('drive')}
                >
                  🚗 Drive
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold border transition ${travelMode === 'fly' ? 'bg-purple-600 text-white border-purple-700' : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'}`}
                  onClick={() => setTravelMode('fly')}
                >
                  ✈️ Fly
                </button>
              </div>

              {/* Route/Price Info */}
              {travelMode === 'drive' && routeInfo && (
                <div className="mb-4">
                  <h4 className="font-semibold">Driving Route Info:</h4>
                  <div>Distance: {routeInfo.distanceMiles?.toFixed(1)} miles</div>
                  <div>Estimated Duration: {routeInfo.duration?.toFixed(0)} min</div>
                  {/* Step-by-step driving directions */}
                  {directions && directions.length > 0 && (
                    <div className="mt-2">
                      <h5 className="font-semibold">Directions:</h5>
                      <ol className="list-decimal ml-6 space-y-1">
                        {directions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
              {travelMode === 'fly' && (
                <div className="mb-4">
                  <h4 className="font-semibold">Flight Info:</h4>
                  {nearestAirport && airports[getStateKey(destinationState)] ? (
                    <>
                      <div>From: {nearestAirport.name} ({nearestAirport.code})</div>
                      <div>To: {airports[getStateKey(destinationState)].name} ({airports[getStateKey(destinationState)].code})</div>
                      {flightEstimate && (
                        <>
                          <div>Distance: {flightEstimate.distance?.toFixed(1)} km</div>
                          <div>Estimated Duration: {flightEstimate.duration?.toFixed(0)} min</div>
                          <div>Estimated Price: ${flightEstimate.price?.toFixed(0)}</div>
                        </>
                      )}
                      {/* Real-time flight results */}
                      {flightResults && flightResults.length > 0 && (
                        <div className="mt-2">
                          <h5 className="font-semibold">Real-Time Flights:</h5>
                          <ul className="list-disc ml-6 space-y-1">
                            {flightResults.map((flight, idx) => (
                              <li key={flight.flight?.iata || idx}>
                                {flight.airline?.name} {flight.flight?.iata} — {flight.departure?.airport} to {flight.arrival?.airport} | Departs: {flight.departure?.scheduled?.slice(0, 16)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-red-600">
                      <div>Flight info unavailable: Could not find your nearest airport.</div>
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select your nearest airport:
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                          value={manualAirportSelection?.code || ''}
                          onChange={(e) => {
                            const selectedCode = e.target.value;
                            const selectedAirport = Object.values(airports).find(airport => airport.code === selectedCode);
                            setManualAirportSelection(selectedAirport);
                          }}
                        >
                          <option value="">Choose an airport</option>
                          {Object.values(airports).map((airport) => (
                            <option key={airport.code} value={airport.code}>
                              {airport.name} ({airport.code}) - {airport.city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Show Hotels Checkbox and List (always visible here) */}
              <div className="mt-4 flex items-center">
                <input
                  id="show-hotels-checkbox"
                  type="checkbox"
                  className="mr-2"
                  checked={showHotels}
                  onChange={async (e) => {
                    setShowHotels(e.target.checked);
                    if (e.target.checked) {
                      setHotels([]);
                      setHotelsError('');
                      setHotelsLoading(true);
                      const coords = effectiveDestinationCoords;
                      if (!coords) {
                        setHotelsError('No destination coordinates available.');
                        setHotelsLoading(false);
                        return;
                      }
                      // Use just 'hotel' as the query for best results, and remove types=poi
                      const query = 'hotel';
                      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${coords.lng},${coords.lat}&limit=10&access_token=${MAPBOX_TOKEN}`;
                      console.log('Hotel search debug (checkbox):', { coords, query, url });
                      try {
                        const res = await fetch(url);
                        const data = await res.json();
                        console.log('Hotel search response (checkbox):', data);
                        if (data.features && data.features.length > 0) {
                          // Loosen filtering: show all features returned by Mapbox
                          setHotels(data.features);
                          console.log('All returned features (checkbox):', data.features);
                        } else {
                          setHotelsError('No hotels found nearby.');
                        }
                      } catch (err) {
                        setHotelsError('Error fetching hotels.');
                        console.error('Hotel search error (checkbox):', err);
                      }
                      setHotelsLoading(false);
                    } else {
                      setHotels([]);
                      setHotelsError('');
                    }
                  }}
                  disabled={!selectedAttraction}
                />
                <label htmlFor="show-hotels-checkbox" className={`font-medium ${!selectedAttraction ? 'text-gray-400' : 'text-gray-700'}`}>Show hotels near this attraction</label>
              </div>
              {showHotels && (
                <div className="mt-2">
                  {hotelsLoading && <div className="text-sm text-gray-500">Loading hotels...</div>}
                  {hotelsError && <div className="text-sm text-red-600">{hotelsError}</div>}
                  {hotels.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Hotels Nearby:</h4>
                      <ul className="list-disc ml-6 space-y-1">
                        {hotels
                          .filter(hotel => {
                            const text = hotel.text?.toLowerCase() || '';
                            const category = hotel.properties?.category?.toLowerCase() || '';
                            const placeName = hotel.place_name?.toLowerCase() || '';
                            const stateName = destinationState?.toLowerCase() || '';
                            return (
                              (text.includes('hotel') || text.includes('inn') || text.includes('motel') || text.includes('resort') ||
                                category.includes('hotel') || category.includes('inn') || category.includes('motel') || category.includes('resort')) &&
                              placeName.includes(stateName)
                            );
                          })
                          .map((hotel, idx) => (
                            <li key={hotel.id || idx}>
                              <span className="font-medium">{hotel.text}</span>
                              <span className="text-gray-600"> — {hotel.place_name}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Persistent Debug Panel (collapsible) */}
      <div className="fixed bottom-0 left-0 w-full bg-yellow-50 border-t border-yellow-300 p-2 text-xs z-50 flex flex-col items-start">
        <button
          className="mb-1 px-2 py-1 bg-yellow-200 border border-yellow-400 rounded text-xs font-bold hover:bg-yellow-300"
          onClick={() => setShowDebug((v) => !v)}
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
        {showDebug ? (
          <div className="w-full">
            <strong>Persistent Debug Info:</strong>
            <div>userLocation: {JSON.stringify(effectiveUserLocation)}</div>
            <div>nearestAirport: {JSON.stringify(nearestAirport)}</div>
            <div>destinationState: {JSON.stringify(destinationState)}</div>
            <div>destinationAirport: {JSON.stringify(airports[getStateKey(destinationState)])}</div>
            <div>travelMode: {JSON.stringify(travelMode)}</div>
            <div>flightDebug: {JSON.stringify(flightDebug)}</div>
            <div>shouldFetchFlights: {String(
              travelMode === 'fly' &&
              nearestAirport &&
              destinationState &&
              airports[getStateKey(destinationState)] &&
              nearestAirport.code &&
              airports[getStateKey(destinationState)]?.code
            )}</div>
          </div>
        ) : (
          <div className="text-gray-700">Debug panel hidden. Click to expand.</div>
        )}
      </div>
    </div>
  );
}

export default App;