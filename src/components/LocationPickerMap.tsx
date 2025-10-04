import React, { useState, useEffect, useRef } from 'react';

import { MapPin, Navigation, Trash2 } from 'lucide-react';


declare global {
  interface Window {
    L: any;
  }
}


export default function LocationPickerMap() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    // Cargar Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    // Cargar Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.async = true;
    
    script.onload = () => {
      if (mapRef.current && !leafletMapRef.current) {
        // Inicializar el mapa centrado en Guayaquil, Ecuador
        const map = window.L.map(mapRef.current).setView([-2.1709, -79.9224], 12);
        leafletMapRef.current = map;

        // Agregar capa de tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Evento de clic en el mapa
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          updateMarker(lat, lng);
          getAddress(lat, lng);
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const updateMarker = (lat: number, lng: number) => {
    if (!leafletMapRef.current) return;

    // Remover marcador anterior si existe
    if (markerRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
    }

    // Crear nuevo marcador
    const customIcon = window.L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    markerRef.current = window.L.marker([lat, lng], { icon: customIcon }).addTo(leafletMapRef.current);
    setPosition({ lat, lng });
  };

  const getAddress = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      setAddress(data.display_name || 'Dirección no disponible');
    } catch (error) {
      setAddress('Error al obtener la dirección');
    }
    setLoading(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([latitude, longitude], 15);
            updateMarker(latitude, longitude);
            getAddress(latitude, longitude);
          }
        },
        (error) => {
          alert('No se pudo obtener tu ubicación: ' + error.message);
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización');
    }
  };

  const clearSelection = () => {
    if (markerRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    setPosition(null);
    setAddress('');
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4 z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-3">
            <MapPin className="text-red-500" size={28} />
            Selector de Ubicación
          </h1>
          <p className="text-gray-600 text-sm">
            Haz clic en el mapa para seleccionar una ubicación exacta
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative" style={{ minHeight: '400px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <button
            onClick={getCurrentLocation}
            className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
            title="Usar mi ubicación actual"
          >
            <Navigation size={20} />
          </button>
          {position && (
            <button
              onClick={clearSelection}
              className="bg-white hover:bg-gray-50 text-red-600 p-3 rounded-lg shadow-lg transition-all hover:shadow-xl"
              title="Limpiar selección"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Info Panel */}
        {position && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 z-[1000] max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="text-red-500" size={20} />
              Ubicación Seleccionada
            </h3>
            
            <div className="space-y-2">
              <div className="flex gap-4 text-sm">
                <div className="flex-1">
                  <span className="text-gray-500 font-medium">Latitud:</span>
                  <p className="text-gray-800 font-mono">{position?.lat.toFixed(6)}</p>
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 font-medium">Longitud:</span>
                  <p className="text-gray-800 font-mono">{position?.lng.toFixed(6)}</p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 font-medium text-sm">Dirección:</span>
                {loading ? (
                  <p className="text-gray-600 italic text-sm mt-1">Cargando dirección...</p>
                ) : (
                  <p className="text-gray-800 text-sm mt-1">{address}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                const coords = `${position?.lat.toFixed(6)}, ${position?.lng.toFixed(6)}`;
                navigator.clipboard.writeText(coords);
                alert('Coordenadas copiadas al portapapeles');
              }}
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
            >
              Copiar Coordenadas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}