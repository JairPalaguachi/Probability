import Checkbox from '@mui/material/Checkbox'; // Correcto: importar Checkbox desde @mui/material
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { useState } from 'react';

export default function CheckBoxFuncional() {
    const [clima, setClima] = useState({
        muyCaliente: false,
        muyFrio: false,
        muyVentoso: false,
        muyHumedo: false,
        muyIncomodo: false,
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClima({
            ...clima, 
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <FormGroup>
            <FormControlLabel
                label="Muy caliente"
                control={
                    <Checkbox
                        
                        checked={clima.muyCaliente}
                        onChange={handleChange}
                        name="muyCaliente"
                    />
                }
            />
            <FormControlLabel
                label="Muy Frio"
                control={
                    <Checkbox
                        checked={clima.muyFrio}
                        onChange={handleChange}
                        name="muyFrio"
                    />
                }
            />
            <FormControlLabel
                label="Muy Ventoso"
                control={
                    <Checkbox
                        checked={clima.muyVentoso}
                        onChange={handleChange}
                        name="muyVentoso"
                    />
                }
            />
            <FormControlLabel
                label="Muy Húmedo"
                control={
                    <Checkbox
                        checked={clima.muyHumedo}
                        onChange={handleChange}
                        name="muyHumedo"
                    />
                }
            />
            <FormControlLabel
                label="Muy Incómodo"
                control={
                    <Checkbox
                        checked={clima.muyIncomodo}
                        onChange={handleChange}
                        name="muyIncomodo"
                    />
                }
            />
        </FormGroup>
    );
}