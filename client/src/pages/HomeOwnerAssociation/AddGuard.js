import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import Navbar from '../../layouts/NavBar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchInput from '../../components/SearchInput/SearchInput';
import axios from '../../utils/axios';
import SideBar from './SideBar';
import SnackbarComp from '../../components/SnackBar/SnackbarComp.js';
export default function AddGuard() {

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [form, setForm] = useState({
        userId: '',
        hoaId: localStorage.getItem('hoaId')
    });
    const [openSnackBar, setOpenSnackBar] = React.useState({
        open:false,
        type:"",
        note:""
    });

    const [stepper, setStepper] = useState(1);
    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            return prev;
        
    });}

    // Submit button for adding guard
    async function Submit(e){
        e.preventDefault();

        try{
            await axios
            .post(
                `/hoas/guards`,
                JSON.stringify({ 
                    userId: form.userId,
                    hoa: form.hoaId,
                    hoaId: form.hoaId
                })
            )
            .then((response) => {
                console.log(JSON.stringify(response?.data));
                setOpenSnackBar(openSnackBar => ({
                    ...openSnackBar,
                    open:true,
                    type:'success',
                    note:"Added Guard Succesfully!",
                }));
                navigate("/guard");
            })
        }
        catch(err){
            setOpenSnackBar(openSnackBar => ({
                ...openSnackBar,
                open:true,
                type:'error',
                note:"Error Occured!",
            }));
            console.error(err.message);
        }
    }

    return <>
        <Navbar type="vehicle"/>
        <div className='SectionHolder'>
            <section className='Section SectionManage'>
                <SideBar active="Guard"/>
                <div>
                    <h3 className='SectionTitleDashboard'><span>Add Guard</span></h3>
                    <div className='SectionContent'>
                        <form onSubmit={Submit} className='Form'>

                            {/* <div>
                                <SearchInput onChange={(e)=>setSearchText(e.target.value)} value={searchText} placeholder="Search User"/>
                                
                            </div> */}
                            {/* <div className='SectionList'>
                                {(hoas.length === 0 )?
                                    <p>No HOAs Available!</p>
                                    :
                                    <>
                                        {(!searchText) ?
                                            hoas.length > 0 && hoas.map((hoa) => {
                                                return (
                                                    <div className='Card__Horizontal' onClick={()=>{setSelectedHoa(hoa.name); updateForm({ hoaId: hoa.hoaId }) }} key={hoa._id} id={hoa._id}>
                                                        <img src={VillageIcon} alt="" />
                                                        <div>
                                                            <h6>{hoa.name}</h6>
                                                            <p>{hoa.city}</p>
                                                        </div>
                                                    </div> 
                                                );
                                            })
                                        :
                                            filteredHoa.length > 0 && filteredHoa.map((hoa) => {
                                                return (
                                                    <div className='Card__Horizontal' onClick={()=>{setSelectedHoa(hoa.name); updateForm({ hoaId: hoa.hoaId }) }} key={hoa._id} id={hoa._id}>
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
                            </div> */}
                            <TextField
                                id="filled-password-input"
                                label="User ID"
                                type="text"
                                autoComplete="current-password"
                                variant="filled"
                                onChange={(e)=>updateForm({ userId: e.target.value })}
                            />
                            <div className='Form__Button'>
                                <Button variant='text' onClick={()=> navigate("/guard")}>cancel</Button>
                                <Button variant='contained' type='submit' className='Submit'>Submit</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/>
        </div>
    </>
}
