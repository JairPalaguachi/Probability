import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';

export function FechaPicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DatePicker label="Elige la Fecha" />
        
      </div>
    </LocalizationProvider>
  );
}
