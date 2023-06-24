import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import Navbar from '../../layouts/NavBar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchInput from '../../components/SearchInput/SearchInput';
import axios from '../../utils/axios';
import SideBar from './SideBar';
import SnackbarComp from '../../components/SnackBar/SnackbarComp.js';
export default function AddHomeowner() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        name: '',
        homeNo: '',
        street: '',
        phase: ''
    });

    const [openSnackBar, setOpenSnackBar] = React.useState({
        open:false,
        type:"",
        note:""
    });

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            console.log(form)
            return prev;
        
    });}

    // Submit button for adding guard
    async function Submit(e){
        e.preventDefault();

        try{
            await axios
            .post(
                `/users/homeowner`,
                {
                    hoaId: localStorage.getItem('hoaId'),
                    resident: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        contactNo: form.contactNo
                    },
                    home: {
                        homeNo: form.homeNo,
                        street: form.street,
                        phase: form.phase
                    }
                }
            )
            .then((response) => {
                setOpenSnackBar(openSnackBar => ({
                    ...openSnackBar,
                    open:true,
                    type:'success',
                    note:"Added Homeowner Succesfully!",
                }));
                alert(`Email: ${form.email} Password: ${response.data.userPassword}`)
                navigate("/residentslist");
            })
        }
        catch(error){
            setOpenSnackBar(openSnackBar => ({
                ...openSnackBar,
                open:true,
                type:'error',
                note: error?.response?.data?.message ?? "Error Occured!",
            }));
            console.error(error.response.data.message);
        }
    }

    return <>
        <Navbar type="vehicle"/>
        <div className='SectionHolder'>
            <section className='Section SectionManage'>
                <SideBar active="Guard"/>
                <div>
                    <h3 className='SectionTitleDashboard'><span>Add Homeowner</span></h3>
                    <div className='SectionContent'>
                        <form onSubmit={Submit} className='Form'>
                            <h3>Homeowner</h3>
                            <TextField
                                id="filled-password-input"
                                label="First Name"
                                type="text"
                                variant="filled"
                                required
                                onChange={(e)=>updateForm({ firstName: e.target.value })}
                            />
                            <TextField
                                id="filled-password-input"
                                label="Last Name"
                                type="text"
                                variant="filled"
                                required
                                onChange={(e)=>updateForm({ lastName: e.target.value })}
                            />
                            <TextField
                                id="filled-password-input"
                                label="Email"
                                type="email"
                                variant="filled"
                                required
                                onChange={(e)=>updateForm({ email: e.target.value })}
                            />
                            <TextField
                                id="filled-password-input"
                                label="Contact No."
                                type="number"
                                variant="filled"
                                required
                                onChange={(e)=>updateForm({ contactNo: e.target.value })}
                            />
                            <h3>Home</h3>
                            <TextField
                                id="filled-password-input"
                                label="Home No."
                                type="text"
                                variant="filled"
                                required
                                onChange={(e)=>updateForm({ homeNo: e.target.value })}
                            />
                            <TextField
                                id="filled-password-input"
                                label="Street"
                                type="text"
                                variant="filled"
                                required
                                onChange={(e)=>updateForm({ street: e.target.value })}
                            />
                            <TextField
                                id="filled-password-input"
                                label="Phase"
                                type="text"
                                variant="filled"
                                required
                                onChange={(e)=>updateForm({ phase: e.target.value })}
                            />
                            <div className='Form__Button'>
                                <Button variant='text' onClick={()=> navigate("/residents")}>cancel</Button>
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
