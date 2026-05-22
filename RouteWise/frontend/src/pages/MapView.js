import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import API from "../api/api";

// Fix default marker icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Function to create numbered marker icons
const createNumberedIcon = (number, isStart = false, isEnd = false) => {
  let bgColor = "#3388ff";
  if (isStart) bgColor = "#22c55e";
  if (isEnd) bgColor = "#ef4444";
  
  return L.divIcon({
    html: `<div style="
      background-color: ${bgColor}; 
      color: white; 
      border-radius: 50%; 
      width: 30px; 
      height: 30px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      border: 2px solid white; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      font-weight: bold;
      font-size: 14px;
    ">${number}</div>`,
    className: 'numbered-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

export default function MapView() {
  const [jobs, setJobs] = useState([]);
  const [salespersonId, setSalespersonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [coordinateIssues, setCoordinateIssues] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (id) {
      setSalespersonId(id);
    }
  }, []);

  useEffect(() => {
    if (!salespersonId) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        console.log("Fetching jobs for salesperson:", salespersonId);
        
        const res = await API.get(`/admin-api/salesperson/${salespersonId}/jobs/`);
        console.log("Full API Response:", res);
        console.log("Response data:", res.data);
        
        // Store raw data for display
        setRawData(res.data);
        
        const allJobs = res.data.jobs || [];
        console.log("All jobs array:", allJobs);
        
        if (allJobs.length === 0) {
          setError("No jobs found for this salesperson");
          setJobs([]);
          setLoading(false);
          return;
        }
        
        // Check each job's coordinates
        const issues = [];
        const validJobs = [];
        
        allJobs.forEach((job, index) => {
          console.log(`\n--- Job ${index} ---`);
          console.log("Full job object:", job);
          
          // Check all possible coordinate field names
          const possibleLatFields = ['customer_latitude', 'latitude', 'lat', 'customer_lat', 'job_latitude'];
          const possibleLngFields = ['customer_longitude', 'longitude', 'lng', 'customer_lng', 'job_longitude'];
          
          let latValue = null;
          let lngValue = null;
          let latField = null;
          let lngField = null;
          
          // Find which latitude field exists
          for (const field of possibleLatFields) {
            if (job[field] !== undefined && job[field] !== null) {
              latValue = job[field];
              latField = field;
              break;
            }
          }
          
          // Find which longitude field exists
          for (const field of possibleLngFields) {
            if (job[field] !== undefined && job[field] !== null) {
              lngValue = job[field];
              lngField = field;
              break;
            }
          }
          
          console.log("Found latitude:", latValue, "from field:", latField);
          console.log("Found longitude:", lngValue, "from field:", lngField);
          console.log("Latitude type:", typeof latValue);
          console.log("Longitude type:", typeof lngValue);
          
          // Try to parse coordinates
          const lat = parseFloat(latValue);
          const lng = parseFloat(lngValue);
          
          const isValid = !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null;
          
          if (!isValid) {
            issues.push({
              job: job,
              index: index,
              latValue: latValue,
              lngValue: lngValue,
              latField: latField,
              lngField: lngField,
              reason: !latValue && !lngValue ? "Missing both coordinates" :
                      !latValue ? "Missing latitude" :
                      !lngValue ? "Missing longitude" :
                      isNaN(lat) ? "Latitude is not a number" :
                      isNaN(lng) ? "Longitude is not a number" : "Unknown issue"
            });
          } else {
            // Create a job with proper coordinates
            validJobs.push({
              ...job,
              customer_latitude: lat,
              customer_longitude: lng
            });
          }
        });
        
        console.log("\n=== Summary ===");
        console.log("Total jobs from API:", allJobs.length);
        console.log("Valid jobs with coordinates:", validJobs.length);
        console.log("Jobs with coordinate issues:", issues.length);
        console.log("Coordinate issues:", issues);
        
        setCoordinateIssues(issues);
        
        if (validJobs.length === 0) {
          setError("No jobs with valid coordinates found. Check console for details.");
          setJobs([]);
        } else {
          // Filter OPTIMIZED status if needed
          const optimizedJobs = validJobs.filter(j => j.status === "OPTIMIZED");
          console.log("Optimized jobs with valid coordinates:", optimizedJobs.length);
          
          setJobs(optimizedJobs.length > 0 ? optimizedJobs : validJobs);
          setError(null);
        }
        
      } catch (err) {
        console.error("API Error:", err);
        setError(`Failed to load jobs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [salespersonId]);

  const validPositions = jobs
    .map(j => {
      const lat = parseFloat(j.customer_latitude);
      const lng = parseFloat(j.customer_longitude);
      return [lat, lng];
    });

  // Default center if no valid jobs
  const defaultCenter = [11.0, 78.0];
  const mapCenter = validPositions.length > 0 ? validPositions[0] : defaultCenter;

  if (loading) {
    return (
      <div style={{ 
        height: "90vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Debug Panel */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        maxHeight: "500px",
        overflow: "auto"
      }}>
        <h4 style={{ margin: "0 0 10px 0" }}>🔍 Debug Information</h4>
        
        <div style={{ marginBottom: "10px" }}>
          <p><strong>Salesperson ID:</strong> {salespersonId || "Not set"}</p>
          <p><strong>Jobs in state:</strong> {jobs.length}</p>
          <p><strong>Valid positions:</strong> {validPositions.length}</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: "#fee", 
            padding: "10px", 
            borderRadius: "4px",
            marginBottom: "10px",
            color: "red"
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {rawData && (
          <details style={{ marginBottom: "10px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Raw API Response
            </summary>
            <pre style={{ 
              fontSize: "10px", 
              overflow: "auto",
              backgroundColor: "#f5f5f5",
              padding: "5px",
              borderRadius: "4px"
            }}>
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </details>
        )}

        {coordinateIssues.length > 0 && (
          <details>
            <summary style={{ cursor: "pointer", fontWeight: "bold", color: "red" }}>
              ⚠️ Coordinate Issues ({coordinateIssues.length})
            </summary>
            <div style={{ marginTop: "5px" }}>
              {coordinateIssues.map((issue, idx) => (
                <div key={idx} style={{
                  backgroundColor: "#fff3f3",
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "5px",
                  fontSize: "11px"
                }}>
                  <strong>Job #{issue.index}:</strong> {issue.job.customer_name || "Unnamed"}<br/>
                  <strong>Issue:</strong> {issue.reason}<br/>
                  <strong>Lat field:</strong> {issue.latField || "None"} = {issue.latValue}<br/>
                  <strong>Lng field:</strong> {issue.lngField || "None"} = {issue.lngValue}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={validPositions.length > 0 ? 8 : 7}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show test markers if no jobs */}
        {jobs.length === 0 && (
          <>
            <Marker position={[13.0827, 80.2707]}>
              <Popup>Chennai (Test Location)</Popup>
            </Marker>
            <Marker position={[11.0168, 76.9558]}>
              <Popup>Coimbatore (Test Location)</Popup>
            </Marker>
            <Marker position={[9.9195, 78.1193]}>
              <Popup>Madurai (Test Location)</Popup>
            </Marker>
          </>
        )}

        {/* Show actual job markers */}
        {jobs.map((job, index) => {
          const lat = parseFloat(job.customer_latitude);
          const lng = parseFloat(job.customer_longitude);
          
          const isStart = index === 0;
          const isEnd = index === jobs.length - 1;

          return (
            <Marker
              key={job.id || index}
              position={[lat, lng]}
              icon={createNumberedIcon(index + 1, isStart, isEnd)}
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <h4 style={{ margin: "0 0 5px 0" }}>Stop #{index + 1}</h4>
                  <p><strong>{job.customer_name || "Unknown"}</strong></p>
                  <p>{job.customer_address || "No address"}</p>
                  <p><small>Status: {job.status}</small></p>
                  <p><small>Lat: {lat}, Lng: {lng}</small></p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Draw polyline */}
        {validPositions.length > 1 && (
          <Polyline 
            positions={validPositions} 
            color="#3388ff" 
            weight={3}
          />
        )}
      </MapContainer>
    </div>
  );
}