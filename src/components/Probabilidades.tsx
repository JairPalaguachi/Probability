import React from 'react';
import { Thermometer, Snowflake, Wind, Droplets, CloudRain, AlertCircle } from 'lucide-react';
import './estilos/Probabilidades.css';

interface WeatherCondition {
  id: string;
  title: string;
  subtitle: string;
  probability: number;
  description: string;
  severity: 'moderado' | 'muy-alto' | 'alto';
  icon: React.ReactNode;
}

export default function Probabilidades() {
  const analysisDate = {
    lat: '22.3176',
    lng: '-99.4523',
    date: '27 de octubre de 2025'
  };

  const conditions: WeatherCondition[] = [
    {
      id: 'muy-caliente',
      title: 'Muy Caliente',
      subtitle: 'Temperatura Superior a 35°C',
      probability: 52,
      description: 'Condición posible. Se sugiere mantener precauciones necesarias ante la fecha.',
      severity: 'moderado',
      icon: <Thermometer style={{ width: 20, height: 20 }} />
    },
    {
      id: 'muy-frio',
      title: 'Muy Frío',
      subtitle: 'Temperatura Inferior a 5°C',
      probability: 13,
      description: 'Condición poco probable basado en datos históricos.',
      severity: 'muy-alto',
      icon: <Snowflake style={{ width: 20, height: 20 }} />
    },
    {
      id: 'muy-ventoso',
      title: 'Muy Ventoso',
      subtitle: 'Ráfaga Superior a 40 Km/h',
      probability: 10,
      description: 'Condición poco probable basado en datos históricos.',
      severity: 'muy-alto',
      icon: <Wind style={{ width: 20, height: 20 }} />
    },
    {
      id: 'muy-humedo',
      title: 'Muy Húmedo',
      subtitle: 'Humedad Superior al 80%',
      probability: 58,
      description: 'Condición posible. Se sugiere mantener precauciones necesarias ante la fecha.',
      severity: 'moderado',
      icon: <Droplets style={{ width: 20, height: 20 }} />
    },
    {
      id: 'muy-inclemente',
      title: 'Muy Inclemente',
      subtitle: '100 gr de agua diarios',
      probability: 61,
      description: 'Se recomienda considerar planes alternativos o preparación especial.',
      severity: 'alto',
      icon: <CloudRain style={{ width: 20, height: 20 }} />
    }
  ];

  const getSeverityBadge = (
    severity: WeatherCondition["severity"]
  ) => {
    const badges: Record<WeatherCondition["severity"], { text: string; className: string }> = {
      moderado: { text: 'Moderado', className: 'probabilidades-badge moderado' },
      'muy-alto': { text: 'Muy Bajo', className: 'probabilidades-badge muy-alto' },
      alto: { text: 'Alto', className: 'probabilidades-badge alto' }
    };
    return badges[severity] || badges.moderado;
  };

  const getProgressColor = (probability: number) => {
    if (probability >= 50) return 'blue';
    if (probability >= 30) return 'yellow';
    return 'gray';
  };

  return (
    <div className="probabilidades-root">
      <div className="probabilidades-container">
        {/* Header */}
        <div className="probabilidades-header">
          <h1 className="probabilidades-title">Resultados del Análisis</h1>
          <button className="probabilidades-btn">
            Nueva Consulta
          </button>
        </div>

        {/* Analysis Info Card */}
        <div className="probabilidades-info-card">
          <h2 className="probabilidades-info-title">Análisis para</h2>
          <p className="probabilidades-info-desc">
            {analysisDate.lat}, {analysisDate.lng} - {analysisDate.date}
          </p>
        </div>

        {/* Section Title */}
        <h2 className="probabilidades-section-title">
          Probabilidades de Condiciones Extremas
        </h2>

        {/* Weather Conditions Cards */}
        <div className="probabilidades-cards">
          {conditions.map((condition) => {
            const badge = getSeverityBadge(condition.severity);
            const progressColor = getProgressColor(condition.probability);

            return (
              <div key={condition.id} className="probabilidades-card">
                {/* Header */}
                <div className="probabilidades-card-header">
                  <div className="probabilidades-card-icon-title">
                    <div>{condition.icon}</div>
                    <div>
                      <h3 className="probabilidades-card-title">{condition.title}</h3>
                      <p className="probabilidades-card-subtitle">{condition.subtitle}</p>
                    </div>
                  </div>
                  <span className={badge.className}>
                    {badge.text}
                  </span>
                </div>

                {/* Probability */}
                <div>
                  <div className="probabilidades-prob-row">
                    <span className="probabilidades-prob-label">Probabilidad</span>
                    <span className="probabilidades-prob-value">{condition.probability}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="probabilidades-progress-bar-bg">
                    <div 
                      className={`probabilidades-progress-bar-fill ${progressColor}`}
                      style={{ width: `${condition.probability}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="probabilidades-card-desc">
                  {condition.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Important Note */}
        <div className="probabilidades-note">
          <AlertCircle className="probabilidades-note-icon" />
          <div className="probabilidades-note-content">
            <h3 className="probabilidades-note-title">Nota Importante</h3>
            <p className="probabilidades-note-desc">
              Estas probabilidades se basan en datos meteorológicos históricos de NASA y no constituyen un pronóstico del tiempo. Para obtener información actualizada sobre las condiciones actuales o previstas, consulte los servicios meteorológicos oficiales de su región.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}