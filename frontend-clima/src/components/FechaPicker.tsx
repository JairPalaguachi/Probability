// En tu archivo: src/components/FechaPicker.tsx

import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';


interface FechaPickerProps {

  onDateChange: (date: Date | null) => void;
}


export function FechaPicker({ onDateChange }: FechaPickerProps) {
 
  const [value, setValue] = useState<Dayjs | null>(dayjs()); 

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    onDateChange(newValue ? newValue.toDate() : null);
  };

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Elige la Fecha y Hora"
        value={value}
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
}