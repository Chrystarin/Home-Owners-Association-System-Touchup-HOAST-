import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NavBar from '../../layouts/NavBar';
import axios from '../../utils/axios';
import './RegisterHoa.scss'
import {useAuth} from '../../utils/AuthContext.js';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';

export default function RegisterHoa() {
    const {isRole} = useAuth();
    const navigate = useNavigate();
    const [nameError, setNameError] = useState('');
    const [streetError, setStreetError] = useState('');
    const [barangayError, setBarangayError] = useState('');
    const [cityError, setCityError] = useState('');
    const [provinceError, setProvinceError] = useState('');

    const role = JSON.parse(localStorage.getItem("role"));

    const validateHOAName = () => {
        if(registerForm.name === '') {
            setNameError('Please fill out field');
        }
        else if (!registerForm.name.endsWith('HOA')) {
            setNameError('HOA at the end is required');
        }
        else {
            setNameError('');
            return registerForm.name;
        }
    };

    const checkStreetField = () => {
        if (registerForm.street === '') {
            setStreetError('Please fill out field');
        }
        else {
            setStreetError('');
            return registerForm.street;
        }
    };

    const checkBarangayField = () => {
        if (registerForm.barangay === '') {
            setBarangayError('Please fill out field');
        }
        else {
            setBarangayError('');
            return registerForm.barangay;
        }
    };

    const checkCityField = () => {
        if (registerForm.city === '') {
            setCityError('Please fill out field');
        }
        else {
            setCityError('');
            return registerForm.city;
        }
    };

    const checkProvinceField = () => {
        if (registerForm.province === '') {
            setProvinceError('Please fill out field');
        }
        else {
            setProvinceError('');
            return registerForm.province;
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
                    street : checkStreetField(),
                    barangay : checkBarangayField(),
                    city : checkCityField(),
                    province : checkProvinceField()
                    
                })
            )
            .then((response) => {
                alert("Registered Successfully!");
                navigate("/dashboard");
                window.location.reload();
            })
        }
        catch(err){
            // alert("Check Credentials!");
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
                            error={streetError ? true : false}
                            helperText={streetError}
                        />
                        <TextField
                            id="filled-password-input"
                            label="Barangay"
                            type="text"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ barangay: e.target.value })}
                            error={barangayError ? true : false}
                            helperText={barangayError}
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
                            error={cityError ? true : false}
                            helperText={cityError}
                        />
                        <TextField
                            id="filled-password-input"
                            label="Province"
                            type="text"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ province: e.target.value })}
                            error={provinceError ? true : false}
                            helperText={provinceError}
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
