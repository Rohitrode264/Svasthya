import React, { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  LocateFixed,
  Search,
  Building2,
  Pill,
  Stethoscope,
  Navigation,
  Loader,
} from "lucide-react";
import { MainWrapper } from "../../component/Wrapper/MainWrapper";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Button } from "../../component/Button";
import { BASE_URL } from "../../config";

export const CareLocator: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [range, setRange] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setError(null);
      },
      () => setError("Unable to retrieve your location. Please allow permission.")
    );
  };

  // ✅ Fetch hospitals
  const fetchHospitals = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    setHospitals([]);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/facilities?lat=${location.lat}&lng=${location.lng}&range=${range}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setHospitals(res.data.hospitals || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Error fetching hospitals");
    } finally {
      setLoading(false);
    }
  };

  // @ts-ignore
  useEffect(() => {
    if (!location) return;

    const map = L.map("map").setView([location.lat, location.lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // User marker
    L.marker([location.lat, location.lng], {
      icon: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
    })
      .addTo(map)
      .bindPopup("You are here");

    // Hospital markers
    hospitals.forEach((h) => {
      if (!h.coordinates) return;
      L.marker(h.coordinates, {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        }),
      })
        .addTo(map)
        .bindPopup(`<b>${h.name}</b><br/>${h.type || "Hospital"}`);
    });

    return () => map.remove();
  }, [location, hospitals]);

  // ✅ Filtered hospitals based on search term
  const filteredHospitals = useMemo(() => {
    if (!searchTerm.trim()) return hospitals;
    return hospitals.filter((h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, hospitals]);

  // ✅ Helper: Choose icon based on facility type
  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("pharmacy")) return <Pill className="w-5 h-5 text-lime-600" />;
    if (t.includes("clinic")) return <Stethoscope className="w-5 h-5 text-emerald-600" />;
    if (t.includes("hospital")) return <Building2 className="w-5 h-5 text-blue-600" />;
    return <MapPin className="w-5 h-5 text-gray-500" />;
  };

  return (
    <MainWrapper>
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className="w-7 h-7 text-lime-600 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              Care Locator
            </h1>
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-lime-500 transition">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search hospital, clinic, pharmacy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 w-56"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <Button
            onClick={getUserLocation}
            icon={<LocateFixed />}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            Use My Location
          </Button>

          <div className="flex items-center space-x-3 flex-grow">
            <label htmlFor="range" className="text-sm text-gray-600 font-medium">
              Range
            </label>
            <input
              type="range"
              id="range"
              min="1"
              max="20"
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="w-44 accent-lime-600"
            />
            <span className="text-gray-700 text-sm">{range} km</span>
          </div>

          <Button
            disabled={!location}
            onClick={fetchHospitals}
            icon={<Search />}
            variant="primary"
            size="sm"
            className="flex-shrink-0"
          >
            Search Nearby
          </Button>
        </div>

        {/* Messages */}
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {loading && (
          <div className="flex items-center text-gray-600 mb-3 text-sm">
            <Loader className="w-4 h-4 animate-spin mr-2" />
            Fetching hospitals...
          </div>
        )}

        {/* Map */}
        <div
          id="map"
          className="w-full h-96 rounded-xl border border-gray-200 shadow-inner mb-8"
        ></div>

        {/* Results */}
        {filteredHospitals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto pr-2">
            {filteredHospitals.map((h, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all h-40"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {h.name}
                    </h2>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                      {h.completeness || ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {getIconForType(h.type)}
                    <span>
                      {h.type} • {h.address?.city || "Unknown City"}
                    </span>
                  </div>
                  {h.address?.street && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {h.address.street}
                    </p>
                  )}
                </div>

                {/* Take Me There button */}
                {h.coordinates && (
                  <Button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${h.coordinates[0]},${h.coordinates[1]}`,
                        "_blank"
                      )
                    }
                    icon={<Navigation />}
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                  >
                    Take Me There
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-400 italic">
              No facilities found. Try adjusting your range or search.
            </p>
          )
        )}
      </div>
    </MainWrapper>
  );
};

export default CareLocator;
