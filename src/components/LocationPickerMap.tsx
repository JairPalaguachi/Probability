import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './estilos/LocationPickerMap.css';

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
  const navigate = useNavigate();

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
    setAddress("");
    let didTimeout = false;
    const timeout = setTimeout(() => {
      didTimeout = true;
      setAddress("Dirección no disponible (tiempo de espera excedido)");
      setLoading(false);
    }, 3000);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (!didTimeout) {
        const data = await response.json();
        clearTimeout(timeout);
        setAddress(data.display_name || 'Dirección no disponible');
        setLoading(false);
      }
    } catch (error) {
      if (!didTimeout) {
        clearTimeout(timeout);
        setAddress('Error al obtener la dirección');
        setLoading(false);
      }
    }
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

  // Nuevo: función para consultar y navegar a probabilidades.html
  const consultarProbabilidades = () => {
    if (position) {
      navigate(`/probabilidades?lat=${position.lat}&lng=${position.lng}`);
    }
  };

  return (
    <div className="location-picker-root">
      {/* Header */}
      <div className="location-picker-header">
        <div className="location-picker-header-content">
          <h1 className="location-picker-title">
            <MapPin style={{ color: '#ef4444' }} size={32} />
            Selector de Ubicación
          </h1>
          <p className="location-picker-subtitle">
            Haz clic en el mapa para seleccionar una ubicación exacta
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="location-picker-map-container">
        <div
          ref={mapRef}
          className="location-picker-map"
        />
        
        {/* Controls */}
        <div className="location-picker-controls">
          <button
            onClick={getCurrentLocation}
            className="location-picker-btn"
            title="Usar mi ubicación actual"
          >
            <Navigation size={20} />
          </button>
          {position && (
            <button
              onClick={clearSelection}
              className="location-picker-btn red"
              title="Limpiar selección"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Info Panel */}
        {position && (
          <div className="location-picker-info-panel">
            <h3 className="location-picker-info-title">
              <MapPin style={{ color: '#ef4444' }} size={20} />
              Ubicación Seleccionada
            </h3>
            
            <div>
              <div className="location-picker-info-row">
                <div>
                  <span className="location-picker-info-label">Latitud:</span>
                  <div className="location-picker-info-value">{position?.lat.toFixed(6)}</div>
                </div>
                <div>
                  <span className="location-picker-info-label">Longitud:</span>
                  <div className="location-picker-info-value">{position?.lng.toFixed(6)}</div>
                </div>
              </div>
              
              <div>
                <span className="location-picker-info-address-label">Dirección:</span>
                {loading ? (
                  <div className="location-picker-info-loading">Cargando dirección...</div>
                ) : (
                  <div className="location-picker-info-address-value">{address}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botón debajo del mapa */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button
          className="location-picker-btn"
          style={{ fontWeight: 'bold', fontSize: '1.1rem', padding: '14px 32px' }}
          onClick={consultarProbabilidades}
          disabled={!position}
        >
          Consultar Probabilidades
        </button>
      </div>
    </div>
  );
}