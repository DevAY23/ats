import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, Tooltip, useMapEvents } from "react-leaflet";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default marker icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const OfficeLocation = () => {
  const baseUrl = `${process.env.REACT_APP_SECRET_KEY}`; // Backend URL
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [officeLocations, setOfficeLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(500); // Default radius
  const [officeName, setOfficeName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all existing office locations
  const fetchOfficeLocations = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api2/officeLocations`);
      setOfficeLocations(response.data);
    } catch (error) {
      console.error("Error fetching office locations:", error);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setSelectedLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficeLocations();
    getCurrentLocation();
  }, []);

  // Custom Map Component for click handling
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setSelectedLocation([e.latlng.lat, e.latlng.lng]); // Update selected location on click
      },
    });
    return null; // No visible component
  };

  // Submit a new office location
  const submitOfficeLocation = async (e) => {
    e.preventDefault();
    if (!selectedLocation || !officeName) {
      alert("Please select a location and enter an office name.");
      return;
    }

    const payload = {
      name: officeName,
      latitude: selectedLocation[0],
      longitude: selectedLocation[1],
      radius,
    };

    try {
      const response = await axios.post(`${baseUrl}/api2/officeLocations`, payload);
      if (response.status === 201 || response.status === 200) {
        alert("Office location added successfully.");
        setOfficeName("");
        setRadius(500);
        fetchOfficeLocations();
      }
    } catch (error) {
      console.error("Error adding office location:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Office Locations</h1>
      {loading ? (
        <p className="text-center">Loading your location...</p>
      ) : (
        <div className="row">
          {/* Map Section */}
          <div className="col-md-8">
            <div className="map-container" style={{ height: "500px", width: "100%", borderRadius: "8px" }}>
              <MapContainer
                center={selectedLocation || [latitude, longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapClickHandler />
                {/* Current Location Marker */}
                {latitude && longitude && (
                  <Marker position={[latitude, longitude]}>
                    <Tooltip>Your Location</Tooltip>
                  </Marker>
                )}
                {/* Selected Location Marker */}
                {selectedLocation && (
                  <>
                    <Marker position={selectedLocation}>
                      <Tooltip>Selected Location</Tooltip>
                    </Marker>
                    <Circle center={selectedLocation} radius={radius} />
                  </>
                )}
                {/* Existing Office Markers */}
                {officeLocations.map((office, index) => (
                  <Marker key={index} position={[office.latitude, office.longitude]}>
                    <Tooltip>{office.name}</Tooltip>
                    <Circle center={[office.latitude, office.longitude]} radius={office.radius} />
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Form Section */}
          <div className="col-md-4">
            <form onSubmit={submitOfficeLocation} className="card p-4 shadow-sm">
              <div className="mb-3">
                <label htmlFor="officeName" className="form-label">
                  Office Name
                </label>
                <input
                  type="text"
                  id="officeName"
                  className="form-control"
                  placeholder="Enter office name"
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="radius" className="form-label">
                  Radius (meters)
                </label>
                <select
                  id="radius"
                  className="form-select"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                >
                  {[500, 700, 1000, 1500].map((value) => (
                    <option key={value} value={value}>
                      {value} meters
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Add Office Location
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeLocation;
