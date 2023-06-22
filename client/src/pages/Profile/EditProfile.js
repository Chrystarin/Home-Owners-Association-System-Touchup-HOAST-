import React, { useState, useEffect } from 'react';

import axios from '../../utils/axios';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import image from '../../images/Placeholder/QRcode.png'
import NavBar from '../../layouts/NavBar';
export default function EditHome() {
    const [stepper, setStepper] = useState(1);

    const [user, setUser] = useState()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const user_id = JSON.parse(localStorage.getItem('user'));
    // console.log(user_id['user'].name.firstName)
    console.log(user_id);

    useEffect(() => {
        const fetchUser = async () => {
            await axios
            .get(`users`)
            .then((response) => {
                setUser(response.data);
                console.log(response.data)
            })
        };
        fetchUser();
    }, []);

    const user_email = user
    console.log(user_email);

    async function Submit(e){
        e.preventDefault();
        try {
            await axios
                .patch(
                    `users`,
                    JSON.stringify({ 
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        password: form.password
                    })
                )
                .then((response) => {
                    console.log(response.data)
                })
        } catch(err){

        }
    }

    if(!user) return <div>Loading...</div>
    return (
        // Edit Home
            <div>
                <NavBar/>
                <div className='SectionHolder'>
                    <section className='Section'>
                        <h3 className='SectionTitleDashboard'><span><a href="/vehicles">Profile</a></span> > <span>Profile Update</span></h3>
                        <div className='SectionStepper'> 
                            <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>General Information</Button>
                        </div>
                        <div className='SectionContent'>
                            <form onSubmit={Submit} className='Form'>
                                <div className='Input__Wrapper2'>
                                    <TextField required fullWidth  label="First Name" defaultValue={user_id['user'].name.firstName} variant="filled"/>
                                    <TextField required fullWidth  label="Last Name" defaultValue={user_id['user'].name.lastName} variant="filled"/>
                                </div>
                                <div className='Input__Wrapper2'>
                                    <TextField required fullWidth  label="Email" defaultValue={user.email} variant="filled"/>
                                    <TextField required fullWidth  label="Password" defaultValue={user.password} variant="filled"/>
                                </div>

                                {/* First Name: <input type="text" value={user_id['user'].name.firstName}/>
                                Last Name: <input type="text" value={user_id['user'].name.lastName}/>
                                Email: <input type="text" value={user.email}/>
                                Passwrod: <input type="text"/> */}
                                <div className='Form__Button'>
                                    <Button variant='text' href='/profile'>Cancel</Button>
                                    <Button variant='contained' type='submit' className='Submit'>Submit</Button>
                                </div>
                                {/* <button type="submit">Submit</button> */}
                            </form> 
                        </div>
                    </section>
                </div>
            </div>
    )
}