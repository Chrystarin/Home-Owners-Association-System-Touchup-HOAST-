import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NavBar from '../../layouts/NavBar';
import axios from '../../utils/axios';
import './RegisterHoa.scss'
import {useAuth} from '../../utils/AuthContext.js';

export default function RegisterHoa() {
    const {isRole} = useAuth();
    const navigate = useNavigate();
    const [nameError, setNameError] = useState('');

    const role = JSON.parse(localStorage.getItem("role"));

    const validateHOAName = () => {
        if (!registerForm.name.endsWith('HOA')) {
            setNameError('HOA at the end is required');
        } else {
            return registerForm.name;
        }
    };

    const [registerForm, setRegisterForm] = useState({
        name: '',
        street: '',
        barangay: '',
        city: '',
        province: ''
    });

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setRegisterForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            console.log(registerForm)
            return prev;
    });}

    // Submit button for login
    async function Submit(e){
        e.preventDefault();

        

        try{
            // Login
            await axios
            .post(
                `hoas/register`,
                JSON.stringify({ 
                    name: validateHOAName(),
                    street : registerForm.street,
                    barangay : registerForm.barangay,
                    city : registerForm.city,
                    province : registerForm.province
                    
                })
            )
            .then((response) => {
                alert("Registered Successfully!");
                navigate("/dashboard");
                window.location.reload();
            })
        }
        catch(err){
            alert("Invalid Credentials!");
            console.error(err.message);
        }
    }

    if(isRole('admin')) navigate("/dashboard");
    if(isRole('guard')) navigate("/scanner");

    

    return <>
        <NavBar/>
        <div className='SectionHolder'>
            <div className='RegisterHoa'>
                <form onSubmit={Submit} className='Form RegisterHoa__Form'>
                    <h4 className='RegisterHoa__Title'> Register Home Owner Association</h4>
                    <TextField
                        id="filled-password-input"
                        label="Name"
                        type="text"
                        autoComplete="current-password"
                        variant="filled"
                        onChange={(e)=>updateForm({ name: e.target.value })}
                        error={nameError ? true : false}
                        helperText={nameError}
                    />
                    <div className='FormWrapper__2'>
                        <TextField
                            id="filled-password-input"
                            label="Street"
                            type="text"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ street: e.target.value })}
                        />
                        <TextField
                            id="filled-password-input"
                            label="Barangay"
                            type="text"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ barangay: e.target.value })}
                        />
                    </div>
                        
                    <div className='FormWrapper__2'>
                        <TextField
                            id="filled-password-input"
                            label="City"
                            type="text"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ city: e.target.value })}
                        />
                        <TextField
                            id="filled-password-input"
                            label="Province"
                            type="text"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ province: e.target.value })}
                        />
                    </div>
                    
                    <div className='Form__Button'>
                        <Button variant="contained" size="large" type='submit'>
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </>

        
    
}
