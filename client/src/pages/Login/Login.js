import React, {useState} from 'react';

import './Login.scss'

import HouseImg from '../../images/House.png'
import Header from '../../layouts/Header';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {useAuth} from '../../utils/AuthContext.js';

function Login() {
    const {login} = useAuth();

    // Contains login input
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [emailError, setEmailError] = useState('');

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            return prev;
        
    });}

    const validateEmail = () => {
      if (!form.email.includes('@')) {
          setEmailError('Please enter a valid email address');
          return;
      } else {
          return form.email;
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
              <h2 className='Title'>LOGIN</h2>
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
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="filled"
                        onChange={(e)=>updateForm({ password: e.target.value })}
                    />
                    <div>
                        <Button variant="contained" size="large" type='submit' onClick={()=>login(validateEmail(), form.password)}>
                            Login
                        </Button>
                    </div>
                </div>
                <p id='Login__Note'>Not a member yet? <a href="/register">Register</a> now!</p>
              </div>
            </div>
          </section>
        </div>
    </div>
  )
}

export default Login;
