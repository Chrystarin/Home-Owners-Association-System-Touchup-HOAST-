import React,{useState, useEffect} from 'react'
import {useNavigate} from 'react-router';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import axios from './../../utils/axios';
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

function AddVisitor() {
    const navigate = useNavigate();

    const [stepper, setStepper] = useState(1);
    const [homes, setHomes] = useState();
    const [openSnackBar, setOpenSnackBar] = React.useState({
        open:false,
        type:"",
        note:""
    });
    const [arrivalValue, setArrivalValue] = useState();
    const [departureValue, setDepartureValue] = useState();
    // Collection of form data
    const [form, setForm] = useState({
        homeId: '',
        name: '',
        purpose: '',
        arrival: '',
        departure: '',
        note: '',
    });

    // Retrieves All User Homes Data onLoad
    useEffect(() => {
        const fetchHomes = async () => {
            await axios
                .get(`homes`)
                .then((response) => {
                    console.log(response.data)
                    setHomes(response.data);
                });
        };
        fetchHomes();
    }, []);

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        console.log(e);
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            console.log(form)
            return prev;
    });}

    // Submit button for Adding Visitor
    async function Submit(e){
        e.preventDefault();
        if(form.arrival < form.departure){
            try{
                await axios
                .post(
                    `visitors`,
                    JSON.stringify({ 
                        homeId: form.homeId,
                        name: form.name,
                        purpose: form.purpose,
                        arrival: form.arrival,
                        departure: form.departure,
                        note: form.note
                    })
                )
                .then((response) => {
                    console.log(JSON.stringify(response?.data));
                    navigate("/visitors");
                })
            }
            catch(err){
                console.error(err.message);
            }
        }else{
            setOpenSnackBar(openSnackBar => ({
                ...openSnackBar,
                open:true,
                type:'error',
                note:"Arrival time is greater than departure time",
            }));
        }
        
    }

    if(!homes) return <>
    <div className='Loading'>
        <img src={loading} alt="" />
        <h3>Loading...</h3>
    </div>
    </>

    return<>
        <Navbar type="vehicle"/>
        <div className='SectionHolder'>
            <section className='Section'>
                <h3 className='SectionTitleDashboard'><span><a href="/visitors">Visitors</a></span>  > <span>Add Visitors</span></h3>

                <div className='SectionStepper'> 
                    <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>General Information</Button>
                </div>
                <div className='SectionContent'>
                    <form onSubmit={Submit} className='Form'>
                        <FormControl required  variant="outlined" fullWidth>
                            <InputLabel  id="home-select">Home</InputLabel>
                            <Select
                                labelId="home-select"
                                value={form.homeId}
                                label="Home"
                                onChange={(e)=>setForm({...form, homeId: e.target.value})}
                            >
                                {homes.length > 0 &&
                                    homes.map((home) => {
                                    return (
                                        <MenuItem key={home.homeId} value={home.homeId}>
                                            {home.name}
                                        </MenuItem> 
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <TextField required fullWidth  label="Name" variant="outlined" onChange={(e)=>updateForm({ name: e.target.value })}/>
                        <div className='FormWrapper__2'>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DateTimePicker']} >
                                    <DateTimePicker 
                                        label="Arrival Date" 
                                        value={arrivalValue}
                                        onChange={(e) =>{ 
                                            setArrivalValue(e);
                                            updateForm({ arrival: e});
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DateTimePicker']} >
                                    <DateTimePicker 
                                        label="Departure Date" 
                                        value={departureValue}
                                        onChange={(e) => {
                                            setDepartureValue(e)
                                            updateForm({departure: e})
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            
                        </div>
                        <div className='FormWrapper__2'>

                            <FormControl required  variant="outlined" fullWidth>
                            <InputLabel  id="home-select">Purpose</InputLabel>
                            <Select
                                labelId="home-select"
                                value={form.purpose}
                                label="Purpose"
                                onChange={(e)=>setForm({...form, purpose: e.target.value})}
                            >
                                <MenuItem value={"Visiting"}>Visiting</MenuItem> 
                                <MenuItem value={"Delivery"}>Delivery</MenuItem> 
                                <MenuItem value={"Occasion"}>Occasion</MenuItem> 
                                <MenuItem value={"Service"}>Service</MenuItem> 
                                <MenuItem value={"Others"}>Others</MenuItem> 
                            </Select>
                        </FormControl>

                            <TextField fullWidth  label="Note" variant="outlined" onChange={(e)=>updateForm({ note: e.target.value })}/>
                        </div>
                        <div className='Form__Button'>
                            <Button variant='text'>Cancel</Button>
                            <Button variant='contained' type='submit' className='Submit'>Submit</Button>
                        </div>
                    </form>
                </div>
            </section>
            <SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/>
        </div>
    </>
}

export default AddVisitor