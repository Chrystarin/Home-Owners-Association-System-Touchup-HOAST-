import React, {useState, useEffect} from 'react'

import {useNavigate} from 'react-router';

import './addResident.scss';
import './../../components/SearchInput/SearchInput.scss'

import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchInput from '../../components/SearchInput/SearchInput';
import VillageIcon from '../../images/icons/Village.png'
import ResidentCard from '../../components/ResidentCard/ResidentCard';

import SearchIcon from '@mui/icons-material/Search';


import axios from './../../utils/axios';

function AddResident() {
    const navigate = useNavigate();
    
    const [stepper, setStepper] = useState(1);
    const [homes, setHomes] = useState();
    const [filteredHome, setFilteredHome] = useState([])
    const [searchText, setSearchText] = useState("");
    const [selectedHome, setSelectedHome] = useState(null);

    // Collection of form data
    const [form, setForm] = useState({
        homeId: '',
        residentName: ''
    });

    // Retrieves All HOme Data onLoad
    useEffect(() => {
        const fetchHomes = async () => {
        const response = await axios
            .get(`homes`)
            .then((response) => {
            setHomes(response.data);
            });
        };
        fetchHomes();
    }, []);

    // Runs search function onLoad for home
    useEffect(() => {
        if (searchText.length) {
            const filterHomes = homes.filter((home) => {
                return (home.owner).toLowerCase().includes(searchText.toLowerCase());
            });
            setFilteredHome(filterHomes);
        } 
        else {
            setFilteredHome([]);
        }
    }, [searchText, homes]);

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            return prev;
    });}

    // Submit Function for Adding Home Request
    async function Submit(e){
        e.preventDefault();
        console.log(form)
        try{
            await axios
            .post(
                `requests`,
                JSON.stringify({ 
                    homeId: form.homeId,
                    residentName: form.residentName
                })
            )
            .then((response) => {
                alert("Request Submitted! Wait for admin to approve your request.");
                navigate("/homes");
            })
        }
        catch(err){
            alert(err.message);
        }
    }
    
    function Stepper(props){
        switch (stepper) {
            case 1:
                return <>
                    <div className='Form' id='GeneralInformation'>
                        <TextField fullWidth label="Resident Name" variant="filled" onChange={(e)=>updateForm({ residentName: e.target.value })} defaultValue={form.residentName}/>
                        {/* <TextField fullWidth label="Home Number" variant="filled" onChange={(e)=>updateForm({ houseNumber: e.target.value })} defaultValue={form.houseNumber}/>
                        <div className='FormWrapper__2'>
                            <TextField fullWidth  label="Street" variant="filled" onChange={(e)=>updateForm({ street: e.target.value })} defaultValue={form.street}/>
                            <TextField fullWidth  label="Phase" variant="filled" onChange={(e)=>updateForm({ phase: e.target.value })} defaultValue={form.phase}/>
                        </div> */}
                        <div className='Form__Button'>
                            <Button variant='contained' type='submit' className='Submit' onClick={()=> {setStepper(2);console.log(form)}}>Next</Button>
                        </div>
                    </div>
                </> 
                break;
            case 2:
                return <>
                    <form onSubmit={Submit} className='Form' id='GeneralInformation'>
                        <div>
                            <SearchInput onChange={(e)=>setSearchText(e.target.value)} value={searchText}/>
                        </div>
                        <p>Selected Home: {selectedHome}</p>
                        <div className='SectionList'>
                            {(props.homes.length === 0 )?
                                <p>No Homes Available!</p>
                                :
                                <>
                                    {(!searchText) ?
                                        props.homes.length > 0 && props.homes.map((home) => {
                                            return (
                                                <div className='Card__Horizontal' onClick={()=>{setSelectedHome(home.owner); updateForm({ homeId: home.homeId }) }} key={home._id} id={home._id}>
                                                    <img src={VillageIcon} alt="" />
                                                    <div>
                                                        <h6>{home.owner}</h6>
                                                    </div>
                                                </div> 
                                            );
                                        })
                                    :
                                        filteredHome.length > 0 && filteredHome.map((home) => {
                                            return (
                                                <div className='Card__Horizontal' onClick={()=>{setSelectedHome(home.owner); updateForm({ homeId: home.homeId }) }} key={home._id} id={home._id}>
                                                    <img src={VillageIcon} alt="" />
                                                    <div>
                                                        <h6>{home.owner}</h6>
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
                </>
                break;
            // case 3:
            //     return <>
            //         <form onSubmit={Submit} className='Form' id='GeneralInformation'>
            //             <div>
            //                 <SearchInput/>
            //             </div>
            //             <div className='SectionList'>
            //                 <ResidentCard UserName="Dianne Chrystalin Brandez" Type="Edit"/>
            //                 <ResidentCard UserName="Vincent Brandez" Type="Edit"/>
            //                 <ResidentCard UserName="Digi-An Brandez" Type="Edit"/>
            //                 <ResidentCard UserName="Nicole Dianne Chrystalin Brandes" Type="Edit"/>
            //                 <ResidentCard UserName="Vinnie Dianne Chrystalin Brandes" Type="Edit"/>
            //             </div>
            //             <div className='Form__Button'>
            //                 <Button variant='text' onClick={()=> setStepper(2)}>Back</Button>
            //                 <Button variant='contained' type='submit' className='Submit' >Submit</Button>
            //             </div>
            //         </form>
            //     </>
            //     break;
        
            default:
                break;
        }
    }

    if(!homes) return <div>Loading...</div>

    return<>
        <Navbar type="home"/>
        <div id='SectionHolder'>
            <section className='Section'>
                <h3 className='SectionTitleDashboard'><span><a href="/homes">Homes</a></span>  > <span>Add Home</span></h3>

                <div className='SectionStepper'> 
                    <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>General Information</Button>
                    <Button variant='text' className={(stepper === 2)?"active":""} onClick={()=> setStepper(2)}>Join Home</Button>
                    {/* <Button variant='text'className={(stepper === 3)?"active":""} onClick={()=> setStepper(3)}>Residents</Button> */}
                </div>
                <div className='SectionContent'>
                    <Stepper homes={homes}/>
                </div>
            </section>
        </div>
    </>
}

export default AddResident