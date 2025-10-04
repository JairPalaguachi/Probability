import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";

interface LocationMapProps {
  onLocationSelect: (location: string, lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

export const LocationMap = ({ onLocationSelect, initialLocation }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet
    const initMap = async () => {
      const L = (await import("leaflet"));
      
      // Fix for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Create map
      const map = L.map(mapRef.current!).setView([23.6345, -102.5528], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add click event
      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(map);
        setPosition({ lat, lng });
        setIsLoading(true);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
          );
          const data = await response.json();

          const locationName =
            data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          
          onLocationSelect(locationName, lat, lng);
          toast.success("Ubicación seleccionada");
        } catch (error) {
          console.error("Error fetching location name:", error);
          toast.error("Error al obtener el nombre de la ubicación");
          onLocationSelect(`${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng);
        } finally {
          setIsLoading(false);
        }
      });

      mapInstanceRef.current = map;

      // Add initial marker if provided
      if (initialLocation) {
        markerRef.current = L.marker([initialLocation.lat, initialLocation.lng]).addTo(map);
        map.setView([initialLocation.lat, initialLocation.lng], 10);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-[400px] rounded-lg overflow-hidden border-2 border-border shadow-lg"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg pointer-events-none">
          <div className="bg-card p-4 rounded-lg shadow-lg">
            <p className="text-sm font-medium">Obteniendo ubicación...</p>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Haz clic en el mapa para seleccionar una ubicación
      </p>
    </div>
  );
};
