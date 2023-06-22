import React from 'react'
import Logo from '../images/logo.PNG';
import './Header.scss';
import Button from '@mui/material/Button';
function Header() {
  return (
    <div id='Header'>
        <div id='Header__Container'>
            <div id="Logo">
                <a href='/'>
                <img  src={Logo} alt="" />

                </a>
            </div>
            <ul>
                <li>
                    <Button variant="" href='#Section1'>About</Button>
                </li>
                <li>
                    <Button variant="" href='#Section2'>FAQ's</Button>
                </li>
                <li>
                    <Button variant="outlined" href='/login'>Login</Button>
                </li>
                <li>
                    <Button variant="contained" href='/register'>Register</Button>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Header