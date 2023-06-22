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
        console.log(form)
        try{
            await axios
            .post(
                `hoas/join`,
                JSON.stringify({ 
                    hoaId: form.hoaId,
                    name: form.houseName,
                    number: form.houseNumber,
                    street: form.street,
                    phase: form.phase,
                    color: form.color,
                    contactNo: form.contactNumber
                })
            )
            .then((response) => {
                // alert("Request Submitted! Wait for admin to approve your request.");
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
            // alert(err.message);
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
                    <Button variant='text' className={(stepper === 2)?"active":""}>Join Homeowners Association</Button>
                </div>
                <div className='SectionContent'>
                    {/* <Stepper hoas={hoas}/> */}
                    {stepper==1?<>
                        <div className='Form' id='GeneralInformation'>
                            <TextField fullWidth label="Home Name" variant="filled" onChange={(e)=>updateForm({ houseName: e.target.value })} defaultValue={form.houseName}/>
                            <TextField fullWidth label="Home Number" variant="filled" onChange={(e)=>updateForm({ houseNumber: e.target.value })} defaultValue={form.houseNumber}/>
                            <div className='FormWrapper__2'>
                                <TextField fullWidth  label="Street" variant="filled" onChange={(e)=>updateForm({ street: e.target.value })} defaultValue={form.street}/>
                                <TextField fullWidth  label="Phase" variant="filled" onChange={(e)=>updateForm({ phase: e.target.value })} defaultValue={form.phase}/>
                            </div>
                            {/* <TextField fullWidth label="Color" variant="filled" onChange={(e)=>updateForm({ color: e.target.value })} defaultValue={form.color}/> */}
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
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
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
                                    onClick={()=> {
                                        
                                        if(form.houseName !== "" && form.houseNumber !== "" && form.houseNumber !== "" && form.street !== "" && form.phase !=="" && form.color !== "" && form.contactNumber !== ""){
                                            setStepper(2);
                                        }else{
                                            setOpenSnackBar(openSnackBar => ({
                                                ...openSnackBar,
                                                open:true,
                                                type:'error',
                                                note:"Check your inputs!",
                                            }));
                                        }
                                        console.log(form)
                                    }}>Next</Button>
                            </div>
                        </div>
                    </>:<></>}
                    {stepper==2?<>
                        <form onSubmit={Submit} className='Form' id='GeneralInformation'>
                            <div>
                                <SearchInput setData={setData} data={hoas} keys={["name"]} filterValue={filterValue}/>
                            </div>
                            <div className='SectionList'>
                                {(hoas.length === 0 )?
                                    <p>No HOAs Available!</p>
                                    :
                                    <>
                                        {
                                            data.length > 0 && data.map((hoa) => {
                                                return (
                                                    <div className={hoa._id===selectedHoa?'Card__Horizontal Active': 'Card__Horizontal'}  onClick={()=>{setSelectedHoa(hoa._id); updateForm({ hoaId: hoa.hoaId }) }} key={hoa._id} id={hoa._id}>
                                                    {/* // <div className='Card__Horizontal' 
                                                    //     onClick={(e)=>{
                                                    //             e.currentTarget.classList.add('cardactive');
                                                    //             setSelectedHoa(hoa.name); 
                                                    //             updateForm({ hoaId: hoa.hoaId }) 
                                                    //         }} key={hoa._id} id={hoa._id}> */}
                                                        <img src={VillageIcon} alt="" />
                                                    <div>
                                                            <h6>{hoa.name}</h6>
                                                            <p>{hoa.city}</p>
                                                        </div>
                                                    </div> 
                                                );
                                            })
                                        }
                                    </>
                                }
                            </div>
                            <div className='Form__Button'>
                            <Button variant='text' onClick={()=> setStepper(1)}>Back</Button>
                                <Button variant='contained' type='submit' className='Submit' >Submit</Button>
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