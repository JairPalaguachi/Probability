import LocationPickerMap from './components/LocationPickerMap';
import InfoPanel from './components/InfoPanel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CheckBox, CheckRounded } from '@mui/icons-material';
import FormControlLabel from '@mui/material/FormControlLabel'; 
import FormGroup from '@mui/material/FormGroup'
import CheckBoxFuncional from './components/CheckBoxFuncional';
function App() {
  return (
    <div className="app-grid">
      <div className="app-grid-left">
        <InfoPanel />
      </div>
      <div className="app-grid-right">
        <LocationPickerMap />
      </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <p>Fecha del Evento</p>
        <DatePicker label="Basic date picker" />
        <p>Condiciones a analizar</p>
        <CheckBoxFuncional/>
      </div>
    </LocalizationProvider>
    </div>
    
  );
}

export default App;