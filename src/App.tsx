import LocationPickerMap from './components/LocationPickerMap';
import InfoPanel from './components/InfoPanel';



function App() {
  return (
    <div className="app-grid">
      <div className="app-grid-left">
        <InfoPanel />
      </div>
      <div className="app-grid-right">
        <LocationPickerMap />
      </div>
    </div>
  );
}

export default App;