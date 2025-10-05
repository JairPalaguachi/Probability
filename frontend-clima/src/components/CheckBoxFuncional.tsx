import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import React from 'react';

interface ClimaOptions {
  muyCaliente: boolean;
  muyFrio: boolean;
  muyVentoso: boolean;
  muyHumedo: boolean;
  muyIncomodo: boolean;
}

interface CheckBoxFuncionalProps {
  clima: ClimaOptions;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckBoxFuncional({ clima, onChange }: CheckBoxFuncionalProps) {
  return (
    <FormGroup>
      <FormControlLabel
        label="Muy caliente"
        control={
          <Checkbox
            checked={clima.muyCaliente}
            onChange={onChange}
            name="muyCaliente"
          />
        }
      />
      <FormControlLabel
        label="Muy Frio"
        control={
          <Checkbox
            checked={clima.muyFrio}
            onChange={onChange}
            name="muyFrio"
          />
        }
      />
      <FormControlLabel
        label="Muy Ventoso"
        control={
          <Checkbox
            checked={clima.muyVentoso}
            onChange={onChange}
            name="muyVentoso"
          />
        }
      />
      <FormControlLabel
        label="Muy Húmedo"
        control={
          <Checkbox
            checked={clima.muyHumedo}
            onChange={onChange}
            name="muyHumedo"
          />
        }
      />
      <FormControlLabel
        label="Muy Incómodo"
        control={
          <Checkbox
            checked={clima.muyIncomodo}
            onChange={onChange}
            name="muyIncomodo"
          />
        }
      />
    </FormGroup>
  );
}