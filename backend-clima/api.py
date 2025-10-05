import requests
import pandas as pd
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
app.config['JSON_AS_ASCII'] = False

USERNAME = "caizapasto_samir"
PASSWORD = "d257xIAe7M5XNt9HcpYY"
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
    estadisticas = {
        'Ubicacion': {'Pais': pais, 'Ciudad': ciudad, 'Latitud': lat, 'Longitud': lon}
    }
    columnas_numericas = ['Temperatura (Celcius)', 'Precipitacion 24h (mm)', 'Velocidad del viento (m/s)', 'Humedad relativa (%)']

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
    return jsonify({"status": "API de clima histórico funcionando"})


@app.route('/api/clima-historico')
def get_clima_historico():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    fecha = request.args.get('fecha')
    formato = request.args.get('formato')
    hora = request.args.get('hora')

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
    app.run(debug=True, port=5000)