import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import axios from '../../utils/axios';
import dayjs from 'dayjs';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import loading from '../../images/loading.gif';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function CreateQuickPass() {
    const navigate = useNavigate();

    const [stepper, setStepper] = useState(1);

    const [openSnackBar, setOpenSnackBar] = React.useState({
        open: false,
        type: '',
        note: ''
    });

    // Collection of form data
    const [form, setForm] = useState({
        name: '',
        purpose: '',
        arrival: '',
        departure: '',
        note: ''
    });

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        console.log(e);
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            console.log(form);
            return prev;
        });
    }

    // Submit button for Adding Visitor
    async function Submit(e) {
        e.preventDefault();

        const arrival = new Date();
        const departure = new Date(arrival.getTime() + 24 * 60 * 60 * 1000);
        console.log(arrival);
        console.log(departure);

        try {
            await axios
                .post(
                    `visitors`,
                    JSON.stringify({
                        hoaId: process.env.REACT_APP_HOA_ID,
                        name: form.name,
                        purpose: form.purpose,
                        arrival: arrival,
                        departure: departure,
                        note: form.note
                    })
                )
                .then((response) => {
                    console.log(JSON.stringify(response?.data));
                    navigate('/visitorslist');
                });
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <>
            <Navbar type="vehicle" />
            <div className="SectionHolder">
                <section className="Section">
                    <h3 className="SectionTitleDashboard">
                        <span>Create Quick Pass</span>
                    </h3>

                    <div className="SectionStepper">
                        <Button variant="text" className={stepper === 1 ? 'active' : ''} onClick={() => setStepper(1)}>
                            General Information
                        </Button>
                    </div>
                    <div className="SectionContent">
                        <form onSubmit={Submit} className="Form">
                            <TextField required fullWidth label="Name" variant="outlined" onChange={(e) => updateForm({ name: e.target.value })} />
                            <div className="FormWrapper__2">
                                {/* <TextField required id="filled-number" InputLabelProps={{shrink: true}} fullWidth type="date" label="Arrival Date" variant="filled" onChange={(e)=>updateForm({ arrival: e.target.value })} defaultValue/> */}
                                {/* <TextField required  id="filled-number" InputLabelProps={{shrink: true}} fullWidth type="date" label="Departure Date" variant="filled" onChange={(e)=>updateForm({ departure: e.target.value })} /> */}
                            </div>
                            <div className="FormWrapper__2">
                                {/* <TextField required fullWidth  label="Purpose" variant="filled" onChange={(e)=>updateForm({ purpose: e.target.value })}/> */}

                                <FormControl required variant="outlined" fullWidth>
                                    <InputLabel id="home-select">Purpose</InputLabel>
                                    <Select
                                        labelId="home-select"
                                        value={form.purpose}
                                        label="Purpose"
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                purpose: e.target.value
                                            })
                                        }
                                    >
                                        <MenuItem value={'Visiting'}>Visiting</MenuItem>
                                        <MenuItem value={'Delivery'}>Delivery</MenuItem>
                                        <MenuItem value={'Occasion'}>Occasion</MenuItem>
                                        <MenuItem value={'Service'}>Service</MenuItem>
                                        <MenuItem value={'Others'}>Others</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField fullWidth label="Note" variant="outlined" onChange={(e) => updateForm({ note: e.target.value })} />
                            </div>
                            <div className="Form__Button">
                                <Button variant="text">Cancel</Button>
                                <Button variant="contained" type="submit" className="Submit">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>
                <SnackbarComp open={openSnackBar} setter={setOpenSnackBar} />
            </div>
        </>
    );
}

export default CreateQuickPass;
