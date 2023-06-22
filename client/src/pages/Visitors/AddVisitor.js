import React,{useState, useEffect} from 'react'
import {useNavigate} from 'react-router';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import axios from './../../utils/axios';

import SnackbarComp from '../../components/SnackBar/SnackbarComp';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
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
    // Collection of form data
    const [form, setForm] = useState({
        homeId: '',
        name: '',
        purpose: '',
        arrival: '',
        departure: '',
        note: '',
    });

    const [purposetype, setPurposeType] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
		setPurposeType(event.target.value);
	};

    // Retrieves All User Homes Data onLoad
    useEffect(() => {
        const fetchHomes = async () => {
            await axios
                .get(`homes`)
                .then((response) => {
                    setHomes(response.data);
                });
        };
        fetchHomes();
    }, []);

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
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
                    // alert("Registered Successfully!");
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

    const purposeTypes = [
        "visiting", "sleepover", "overnight", "vacation", "delivery", "service", "other"
    ]

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
                        <FormControl required  variant="filled" fullWidth>
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
                        <TextField required fullWidth  label="Name" variant="filled" onChange={(e)=>updateForm({ name: e.target.value })}/>
                        <div className='FormWrapper__2'>
                            {/* <TextField required id="filled-number" InputLabelProps={{shrink: true}} fullWidth type="date" label="Arrival Date" variant="filled" onChange={(e)=>updateForm({ arrival: e.target.value })} defaultValue/>
                            <TextField required  id="filled-number" InputLabelProps={{shrink: true}} fullWidth type="date" label="Departure Date" variant="filled" onChange={(e)=>updateForm({ departure: e.target.value })} /> */}

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker required fullWidth variant="filled" label="Arrival Date" onChange={(e)=>updateForm({ arrival: e.target.value })} defaultValuevalue={form.arrival} />
                                </DemoContainer>
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker required fullWidth variant="filled" label="Departure Date" onChange={(e)=>updateForm({ departure: e.target.value })} defaultValuevalue={form.departure} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <div className='FormWrapper__2'>
                            {/* <TextField required fullWidth  label="Purpose" variant="filled" onChange={(e)=>updateForm({ purpose: e.target.value })}/> */}

                            <FormControl
                                    maxWidth
									required
									variant="filled"
									sx={{ m: 1, minWidth: 120 }}
								>
									<InputLabel id="demo-simple-select-filled-label">
										Purpose
									</InputLabel>
									<Select
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										value={purposetype}
										onChange={(e) => {
											setPurposeType(e.target.value);
											updateForm({
												purpose: e.target.value
											});
										}}
									>
										<MenuItem value="">
											<em>None</em>
										</MenuItem>
										{purposeTypes.map((type, index) => {
											return (
												<MenuItem
													key={index}
													value={type}
												>
													{type}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>

                            <TextField required fullWidth  label="Note" variant="filled" onChange={(e)=>updateForm({ note: e.target.value })}/>
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