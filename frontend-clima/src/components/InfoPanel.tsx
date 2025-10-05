import { Cloud, CheckCircle, Mountain, Tent, Calendar, Compass } from 'lucide-react';
import './estilos/InfoPanel.css';
import React from 'react';

interface InfoPanelProps {
  lat: number | undefined;
  lng: number | undefined;
}

export default function InfoPanel({ lat, lng }: InfoPanelProps) {
  const features = [
    {
      icon: <Mountain className="info-panel-feature-icon" />,
      text: "Explorar actividades al aire libre"
    },
    {
      icon: <Tent className="info-panel-feature-icon" />,
      text: "Planificar excursiones, senderismo o camping"
    },
    {
      icon: <Calendar className="info-panel-feature-icon" />,
      text: "Organizar eventos y celebraciones"
    },
    {
      icon: <Compass className="info-panel-feature-icon" />,
      text: "Gestionar expediciones y viajes"
    }
  ];

  return (
    <div className="info-panel-root">
      <div className="info-panel-content">
        <div className="info-panel-badge">
          <Cloud className="info-panel-badge-icon" />
          <span className="info-panel-badge-text">Datos de Observación de la Tierra</span>
        </div>

        <h1 className="info-panel-title">
          Planifica con Confianza
        </h1>

        <p className="info-panel-subtitle">
          Accede a datos climáticos extremos para históricos de la NASA
        </p>

        <div className="info-panel-coords-card">
          <h3 className="info-panel-coords-title">Ubicación Seleccionada</h3>
          {lat && lng ? (
            <div className="info-panel-coords-values">
              <span><strong>Latitud:</strong> {lat.toFixed(4)}</span>
              <span><strong>Longitud:</strong> {lng.toFixed(4)}</span>
            </div>
          ) : (
            <p className="info-panel-coords-placeholder">
              Selecciona un punto en el mapa para empezar.
            </p>
          )}
        </div>

        <div>
          <h2 className="info-panel-features-title">
            ¿Para qué sirve esta herramienta?
          </h2>
          
          <ul className="info-panel-features-list">
            {features.map((feature, index) => (
              <li key={index} className="info-panel-feature-item">
                {feature.icon}
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="info-panel-nasa-card">
            <div className="info-panel-nasa-card-row">
              <div className="info-panel-nasa-icon-bg">
                <CheckCircle className="info-panel-nasa-icon" />
              </div>
              <div>
                <h3 className="info-panel-nasa-title">
                  Datos de NASA
                </h3>
                <p className="info-panel-nasa-desc">
                  Utilizamos variables meteorológicas globales recopiladas por la NASA durante 
                  décadas: precipitación, temperatura, velocidad del viento, humedad y más.
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}