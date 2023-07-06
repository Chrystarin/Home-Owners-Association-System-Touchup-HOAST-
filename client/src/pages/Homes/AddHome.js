import React, {useState, useEffect} from 'react'

import {useNavigate} from 'react-router';

import './AddHome.scss';
import './../../components/SearchInput/SearchInput.scss'

import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchInput from '../../components/SearchInput/SearchInput';
import VillageIcon from '../../images/icons/Village.png'
import loading from '../../images/loading.gif';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';

import axios from './../../utils/axios';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function AddHome() {
    const navigate = useNavigate();
    
    const [stepper, setStepper] = useState(1);
    const [hoas, setHoas] = useState();
    const [filteredHoa, setFilteredHoa] = useState([])
    const [searchText, setSearchText] = useState("");
    const [selectedHoa, setSelectedHoa] = useState(null);
    
    const [data,setData] = useState({});
    const [openSnackBar, setOpenSnackBar] = React.useState({
        open:false,
        type:"",
        note:""
    });
    const [filterValue,setFilterValue] = useState(
        {
            sortBy:"A_Z"
        }
    );
    // Collection of form data
    const [form, setForm] = useState({
        hoaId: '',
        houseName: '',
        houseNumber: '',
        street: '',
        phase: '',
        color: '',
        contactNumber: ''
    });

    const [colors, setColor] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
		setColor(event.target.value);
	};

    // Retrieves All HOA Data onLoad
    useEffect(() => {
        const fetchHoas = async () => {
            await axios
            .get(`hoas`)
            .then((response) => {
                setHoas(response.data);
            });
        };
        fetchHoas();
    }, []);

    // Runs search function onLoad for hoa
    

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            console.log(form)
            return prev;
    });}

    // Submit Function for Adding Home Request
    async function Submit(e){
        e.preventDefault();
        console.log(process.env.REACT_APP_HOA_ID)
        try{
            await axios
            .post(
                `hoas/join`,
                JSON.stringify({ 
                    hoaId: process.env.REACT_APP_HOA_ID,
                    name: form.houseName,
                    number: form.houseNumber,
                    street: form.street,
                    phase: form.phase,
                    color: form.color,
                    contactNo: form.contactNumber
                })
            )
            .then((response) => {
                navigate("/homes");
            })
        }
        catch(err){
            console.log(err.response.data.message);
            setOpenSnackBar(openSnackBar => ({
                ...openSnackBar,
                open:true,
                type:'error',
                note:"Check your inputs",
            }));
        }
    }

    const houseColor = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

    if(!hoas) return <>
        <div className='Loading'>
            <img src={loading} alt="" />
            <h3>Loading...</h3>
        </div>
    </>

    return<>
        <Navbar type="home"/>
        <div className='SectionHolder'>
            <section className='Section'>
                <h3 className='SectionTitleDashboard'><span><a href="/homes">Homes</a></span> <span>Add Home</span></h3>

                <div className='SectionStepper'> 
                    <Button variant='text' className={(stepper === 1)?"active":""}>General Information</Button>
                </div>
                <div className='SectionContent'>
                    {stepper==1?<>
                        <form onSubmit={Submit}>
                            <div className='Form' id='GeneralInformation'>
                                <TextField 
                                    fullWidth 
                                    label="Home Name" 
                                    variant="filled" 
                                    required
                                    onChange={(e)=>updateForm({ houseName: e.target.value })} 
                                    defaultValue={form.houseName}/>
                                <TextField 
                                    fullWidth 
                                    label="Home Number" 
                                    variant="filled" 
                                    required
                                    onChange={(e)=>updateForm({ houseNumber: e.target.value })} 
                                    defaultValue={form.houseNumber}
                                />
                                <div className='FormWrapper__2'>
                                    <TextField 
                                        fullWidth  
                                        label="Street" 
                                        variant="filled" 
                                        required
                                        onChange={(e)=>updateForm({ street: e.target.value })} 
                                        defaultValue={form.street}
                                    />
                                    <TextField 
                                        fullWidth  
                                        label="Phase" 
                                        variant="filled" 
                                        required
                                        onChange={(e)=>updateForm({ phase: e.target.value })} 
                                        defaultValue={form.phase}
                                    />
                                </div>
                                <FormControl
                                    maxWidth
                                    variant="filled"
                                    sx={{ m: 1, minWidth: 120 }}
                                >
                                    <InputLabel id="demo-simple-select-filled-label">
                                        Color
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={colors}
                                        onChange={(e) => {
                                            setColor(e.target.value);
                                            updateForm({
                                                color: e.target.value
                                            });
                                        }}
                                    >
                                        {houseColor.map((houseColor, index) => {
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    value={houseColor}
                                                >
                                                    {houseColor}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <TextField fullWidth label="Contact Number" variant="filled" onChange={(e)=>updateForm({ contactNumber: e.target.value })} defaultValue={form.contactNumber}/>
                                <div className='Form__Button'>
                                    <Button 
                                        variant='contained' 
                                        type='submit' 
                                        className='Submit' 
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </>:<></>}
                </div>
            </section>
            <SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/>
        </div>
    </>
}

export default AddHome