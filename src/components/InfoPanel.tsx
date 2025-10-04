import React from 'react';
import { Cloud, CheckCircle, Mountain, Tent, Calendar, Compass } from 'lucide-react';

export default function InfoPanel() {
  const features = [
    {
      icon: <Mountain className="w-5 h-5" />,
      text: "Explorar actividades al aire libre"
    },
    {
      icon: <Tent className="w-5 h-5" />,
      text: "Planificar excursiones, senderismo o camping"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      text: "Organizar eventos y celebraciones"
    },
    {
      icon: <Compass className="w-5 h-5" />,
      text: "Gestionar expediciones y viajes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-8">
          <Cloud className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-medium">Datos de Observación de la Tierra</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Planifica con Confianza
        </h1>

        {/* Subtitle */}
        <p className="text-blue-100 text-lg md:text-xl mb-12 leading-relaxed">
          Accede a datos climáticos extremos para históricos de la NASA
        </p>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            ¿Para qué sirve esta herramienta?
          </h2>
          
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-white text-lg">
                <div className="mt-1 text-blue-200">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* NASA Data Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Datos de NASA
              </h3>
              <p className="text-gray-600 leading-relaxed">
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