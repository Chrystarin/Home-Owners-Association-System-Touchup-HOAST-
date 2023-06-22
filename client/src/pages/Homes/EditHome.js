import React, {useEffect, useState} from 'react';
import './EditHome.scss';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import {useAuth} from '../../utils/AuthContext.js';
import Navbar from '../../layouts/NavBar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ResidentCard from '../../components/ResidentCard/ResidentCard';
import { useNavigate } from 'react-router';
import SearchInput from '../../components/SearchInput/SearchInput';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';
function EditHome() {
    const { id } = useParams();
    const {isHomeowner} = useAuth();

    const [name, setName] = useState()
    const [color, setColor] = useState()
    const [contactNumber, setContactNumber] = useState()
    const [home, setHome] = useState()
    const [residents, setResidents] = useState()
    const [residentAdd, setResidentAdd] = useState()
    const [openSnackBar, setOpenSnackBar] = React.useState({
        open:false,
        type:"",
        note:""
    });
    const navigate = useNavigate();

    // Retrieve Home Info
    const fetchHome = async () => {
        await axios
        .get(`homes`,{
                params: {
                    homeId: id
                }
            })
        .then((response) => {
            setHome(response.data);
            let [owner, ...reds] = response.data.residents;
            setResidents(reds)
            console.log(residents)
        })
    }
    
    async function Submit(e){
        e.preventDefault();
        try {
            await axios
                .patch(
                    `homes`,
                    JSON.stringify({ 
                        name: name,
                        color: color,
                        contactNumber: contactNumber,
                        homeId: id
                    })
                )
                .then((response) => {
                    console.log(response.data)
                })
        } catch(err){

        }
        navigate("/homes")
    }

    async function AddResident(e){
        e.preventDefault();
        try {
            await axios
                .post(
                    `residents`,
                    JSON.stringify({ 
                        userId: residentAdd,
                        homeId: id
                    })
                )
                .then((response) => {
                    setOpenSnackBar(openSnackBar => ({
                        ...openSnackBar,
                        open:true,
                        type:'success',
                        note:"Resident Added",
                    }));
                    fetchHome()
                })
        } catch(err){
            setOpenSnackBar(openSnackBar => ({
                ...openSnackBar,
                open:true,
                type:'error',
                note:"Resident exist on the list",
            }));
        }
    }

    async function RemoveResident(residentId){
        console.log(id)
        try {
            await axios
                .patch(
                    `residents`,
                    JSON.stringify({ 
                        residentId: residentId,
                        homeId: id
                    })
                )
                .then((response) => {
                    setOpenSnackBar(openSnackBar => ({
                        ...openSnackBar,
                        open:true,
                        type:'error',
                        note:"Resident Removed",
                    }));
                    
                    fetchHome()
                })
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchHome();
	}, []);


    if(!home || !residents) return <div>Loading...</div>

    return (
        <div>
            <Navbar type="home"/>
            <div className='SectionHolder'>
            <section className='Section'>
                <h3 className='SectionTitleDashboard'>Edit Home</h3>
                    <div className='SectionContent' id='ViewHome'>
                        <div className='Form' id='ViewHome__Content'>
                            <div className='EditHome'>
                                <TextField
                                    className='EditHome__Name'
                                    id="filled-password-input"
                                    label="Name"
                                    type="text"
                                    autoComplete="current-password"
                                    variant="filled"
                                    defaultValue={home.name}
                                    onChange={(e)=>setName(e.target.value )}
                                />
                                <TextField
                                    className='EditHome__Name'
                                    id="filled-password-input"
                                    label="Color"
                                    type="text"
                                    autoComplete="current-password"
                                    variant="filled"
                                    defaultValue={home.color}
                                    onChange={(e)=>setColor(e.target.value )}
                                />
                                <TextField
                                    className='EditHome__Name'
                                    id="filled-password-input"
                                    label="Contact Number"
                                    type="text"
                                    autoComplete="current-password"
                                    variant="filled"
                                    defaultValue={home.conactNumber}
                                    onChange={(e)=>setContactNumber(e.target.value )}
                                />
                                <div className='EditHome__ResidentList'>
                                    <h5>List of Residents</h5>
                                    <div className='FormWrapper__2__1'>
                                            <TextField
                                                id="filled-password-input"
                                                label="Residents ID"
                                                type="text"
                                                autoComplete="current-password"
                                                variant="filled"
                                                onChange={(e)=>setResidentAdd(e.target.value)}
                                            />
                                        <Button variant="contained"  type='submit' onClick={AddResident}>
                                            Add
                                        </Button>
                                    </div>
                                    <div>
                                        {(residents.length === 0 )?
                                        <p>No Residents Available!</p>
                                        :
                                        <>
                                            <h6>List of Residents</h6>
                                            <br />
                                            <div className='ResidentListWrapper'>
                                                {residents.length > 0 && residents.map((resident) => {
                                                    if(resident.status=="active")
                                                    return (
                                                        // <p>{JSON.stringify(resident.user.name.firstName)}</p>
                                                        <ResidentCard 
                                                            key={resident._id} 
                                                            username={resident.user.name.firstName + ' ' + resident.user.name.lastName} 
                                                            type="Edit"
                                                            action={()=>RemoveResident(resident.user.userId)}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <br />
                                            <hr />
                                            <br />
                                            <h6>Removed Residents</h6>
                                            <br />
                                            <div className='ResidentListWrapper'>
                                                {residents.length > 0 && residents.map((resident) => {
                                                    if(resident.status=="inactive")
                                                    return (
                                                        // <p>{JSON.stringify(resident.user.name.firstName)}</p>
                                                        <ResidentCard 
                                                            key={resident._id} 
                                                            username={resident.user.name.firstName + ' ' + resident.user.name.lastName} 
                                                            type="View"
                                                            action={()=>RemoveResident(resident.user.userId)}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            
                                        </>
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            <div className='Form__Button'>
                                <Button variant="contained" size="large" type='submit' onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button variant="contained" size="large" type='submit' onClick={Submit}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
            </section>
            </div>
            <SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/>
        </div>
        
    )
}

export default EditHome