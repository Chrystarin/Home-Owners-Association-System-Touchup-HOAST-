import React, {useState} from 'react';

import './Login.scss'

import HouseImg from '../../images/House.png'
import Header from '../../layouts/Header';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {useAuth} from '../../utils/AuthContext.js';

function Login() {

    // Contains login input
    const [form, setForm] = useState({
        password: ''
    });

    const [btnState, setBtnState] = useState();
    SetBtnState(true);
    
    const [emailError, setEmailError] = useState('');

    let otp = {};
	const [inputOtp, setInputOtp] = useState();

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            return prev;
        
    });}

    async function Submit(e) {
		e.preventDefault();
		try {
			await axios
				.patch(
					`updatepassword`,
					JSON.stringify({
						password: form.password
					})
				)
				.then((response) => {
					console.log(response.data);
				});
		} catch (err) {}
	}

    const generateOTP = () => {
		var OTP = '';
		var characters = '0123456789';
		var charactersLength = characters.length;

		for (var i = 0; i < 6; i++) {
			OTP += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		otp = OTP;
	};

    const sendVerification = async () => {
		generateOTP();
		console.log(otp);
		try {
			await axios
				.post('users/verify', {
					email: user.email,
					message:
						'Your OTP for your Email verification is ' + otp + '.'
				})
				.then((response) => {
					console.log(otp);
					alert('Email Sent Successfully!');
				});
		} catch (error) {
			alert(error.response.data);
		}
	};

	const verifyOtp = () => {
		console.log(inputOtp);
		if (otp === inputOtp) {
            setBtnState(false);
			alert('OTP verified');
		} else {
			alert('OTP not verified');
		}
	};

    return (
        <div>
            <Header/>
            <div className='SectionHolder'>
            <section className='Section' id='Login'>
                <div id='Login__Img'>
                <img src={HouseImg} alt="" />
                </div>
                <div id='Login__Container'>
                <h2 className='Title'>Forgot Password</h2>
                <div className='Login__Form'>
                    <div className='FormReplacement'>
                        <TextField
                            label="Email"
                            type="email"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ email: e.target.value })}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            id="filled-password-input"
                            label="Code"
                            type="text"
                            InputProps={ maxLength = 6}
                            autoComplete="current-password"
                            variant="filled"
                        />

                        <TextField
                            disabled={btnState}
                            id="filled-password-input"
                            label="New Password"
                            type="password"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e)=>updateForm({ password: e.target.value })}
                        />
                        <div>
                            <Button variant="contained" size="large" onClick={()=> sendVerification()}>
                                Send Code
                            </Button>
                            <Button variant="contained" size="large" onClick={()=> verifyOtp()}>Verify</Button>
                            
                            <Button disabled={btnState} variant="contained" size="large" onClick={()=> Submit()}>Enter</Button>
                        </div> 
                    </div>
                </div>
                </div>
            </section>
        </div>
    </div>
    )
}

export default Login;