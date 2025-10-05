import requests
import pandas as pd
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import os

app = Flask(__name__)

# Configurar CORS para permitir requests desde cualquier origen
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # En producción puedes cambiar esto por tu dominio específico de Vercel
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

app.config['JSON_AS_ASCII'] = False

# Usar variables de entorno si están disponibles, sino usar los valores por defecto
USERNAME = os.environ.get("METEOMATICS_USERNAME", "caizapasto_samir")
PASSWORD = os.environ.get("METEOMATICS_PASSWORD", "d257xIAe7M5XNt9HcpYY")
YEARS = 10

def generar_estadisticas_climaticas(lat, lon, fecha_str, hora="12:00:00"):
    fecha_obj = datetime.strptime(fecha_str, "%d-%m-%y")
    
    try:
        location_url = f"https://us1.locationiq.com/v1/reverse?key=pk.7341bc5d2594bcb57705ec5503a9e84b&lat={lat}&lon={lon}&format=json"
        location_response = requests.get(location_url, timeout=10)
        if location_response.status_code == 200:
            location_data = location_response.json()
            pais = location_data.get('address', {}).get('country', 'Desconocido')
            ciudad = location_data.get('address', {}).get('city') or location_data.get('address', {}).get('town') or location_data.get('address', {}).get('village') or 'Desconocido'
        else:
            pais, ciudad = 'Desconocido', 'Desconocido'
    except requests.RequestException:
        pais, ciudad = 'Desconocido', 'Desconocido'

    parametros = "t_2m:C,precip_24h:mm,wind_speed_10m:ms,relative_humidity_2m:p"
    resultados = []

    for i in range(YEARS):
        fecha_consulta = fecha_obj - timedelta(days=365 * i)
        fecha_iso = fecha_consulta.strftime("%Y-%m-%d")
        url = f"https://api.meteomatics.com/{fecha_iso}T{hora}Z/{parametros}/{lat},{lon}/json"
        try:
            response = requests.get(url, auth=(USERNAME, PASSWORD), timeout=30)
            if response.status_code == 200:
                data = response.json()
                registro = {'Año': fecha_consulta.year}
                for param_data in data.get('data', []):
                    param_name = param_data.get('parameter')
                    value = param_data.get('coordinates', [{}])[0].get('dates', [{}])[0].get('value')
                    if value is not None:
                        if 't_2m:C' in param_name:
                            registro['Temperatura (Celcius)'] = value
                        elif 'precip_24h:mm' in param_name:
                            registro['Precipitacion 24h (mm)'] = value
                        elif 'wind_speed_10m:ms' in param_name:
                            registro['Velocidad del viento (m/s)'] = value
                        elif 'relative_humidity_2m:p' in param_name:
                            registro['Humedad relativa (%)'] = value
                resultados.append(registro)
        except requests.RequestException as e:
            print(f"Error consultando Meteomatics para el año {fecha_consulta.year}: {e}")
            continue

    if not resultados:
        return {"error": "No se pudieron obtener datos históricos para la ubicación y fecha especificadas."}, pd.DataFrame()

    df = pd.DataFrame(resultados)
    total_years = len(df)

    estadisticas = {
        'Ubicacion': {'Pais': pais, 'Ciudad': ciudad, 'Latitud': lat, 'Longitud': lon}
    }
    columnas_numericas = ['Temperatura (Celcius)', 'Precipitacion 24h (mm)', 'Velocidad del viento (m/s)', 'Humedad relativa (%)']

    # --- Cálculo de Probabilidades de Condiciones Extremas ---
    if total_years > 0:
        probabilidades = {
            'Temp. > 35°C (Calor)': round((df[df['Temperatura (Celcius)'] > 35].shape[0] / total_years) * 100),
            'Temp. < 5°C (Frío)': round((df[df['Temperatura (Celcius)'] < 5].shape[0] / total_years) * 100),
            # 40 km/h es aprox 11.1 m/s
            'Viento > 40km/h': round((df[df['Velocidad del viento (m/s)'] > 11.1].shape[0] / total_years) * 100),
            'Humedad > 80%': round((df[df['Humedad relativa (%)'] > 80].shape[0] / total_years) * 100),
            # Usamos 20mm como umbral para precipitación intensa
            'Precip. > 20mm (Intensa)': round((df[df['Precipitacion 24h (mm)'] > 20].shape[0] / total_years) * 100),
        }
        estadisticas['Probabilidades'] = probabilidades

    # --- Cálculo de Estadísticas (Min, Max, Promedio) ---
    for col in columnas_numericas:
        if col in df.columns and df[col].notna().any():
            estadisticas[col] = {
                'Promedio': round(df[col].mean(), 2),
                'Maximo': round(df[col].max(), 2),
                'Minimo': round(df[col].min(), 2)
            }
            
    return estadisticas, df

@app.route('/')
def index():
    return jsonify({"status": "API de clima historico funcionando", "version": "1.0"})


@app.route('/api/clima-historico')
def get_clima_historico():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    fecha = request.args.get('fecha')
    formato = request.args.get('formato')
    hora = request.args.get('hora', '12:00:00')  # Valor por defecto si no se proporciona

    if not all([lat, lon, fecha]):
        return jsonify({"error": "Faltan parámetros. Se requiere lat, lon y fecha."}), 400
    try:
        estadisticas, df_datos = generar_estadisticas_climaticas(float(lat), float(lon), fecha, hora)
        
        if "error" in estadisticas:
            return jsonify(estadisticas), 404

        if formato and formato.lower() == 'csv':
            filename = f"historico_climatico_{lat}_{lon}_{fecha}.csv"
            csv_output = df_datos.to_csv(index=False)
            
            return Response(
                csv_output,
                mimetype="text/csv",
                headers={"Content-disposition":
                         f"attachment; filename={filename}"}
            )
        else:
            return jsonify(estadisticas)

    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify({"error": "Ocurrió un error interno en el servidor."}), 500

if __name__ == "__main__":
    # Solo para desarrollo local
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)