import React, { useState, useEffect } from 'react';

import axios from '../../utils/axios';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import image from '../../images/Placeholder/QRcode.png';
import NavBar from '../../layouts/NavBar';
import emailjs from '@emailjs/browser';

export default function EditHome() {
    const [stepper, setStepper] = useState(1);

    const [user, setUser] = useState();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPass: ''
    });

    let otp = null;
    const [otpStatus, setOtpStatus] = useState(false);
    const [inputOtp, setInputOtp] = useState();
    const user_id = JSON.parse(localStorage.getItem('user'));
    // console.log(user_id['user'].name.firstName)
    console.log(user_id);

    useEffect(() => {
        const fetchUser = async () => {
            await axios.get(`users`).then((response) => {
                setUser(response.data);
                console.log(response.data);
            });
        };
        fetchUser();
    }, []);

    const user_email = user;
    console.log(user_email);

    async function Submit(e) {
        e.preventDefault();

        console.log(form);

        if (form.password === form.confirmPass) {
            try {
                await axios
                    .patch(
                        `users`,
                        JSON.stringify({
                            firstName: form.firstName || user_id['user'].name.firstName,
                            lastName: form.lastName || user_id['user'].name.lastName,
                            email: form.email || user.email,
                            password: form.password || null
                        })
                    )
                    .then((response) => {
                        console.log(response.data);
                    });
            } catch (err) {}
        } else {
            alert('Password does not match');
        }
    }

    const generateOTP = () => {
        var OTP = '';
        var characters = '0123456789';
        var charactersLength = characters.length;

        for (var i = 0; i < 6; i++) {
            OTP += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        localStorage.setItem('otp', OTP);
    };

    const sendVerification = async () => {
        generateOTP();
        try {
            await axios
                .post('users/verify', {
                    email: form.email,
                    message: 'Your OTP for your Email verification is ' + localStorage.getItem('otp') + '.'
                })
                .then((response) => {
                    alert('Email Sent Successfully!');
                });
        } catch (error) {
            alert(error.response.data);
        }
    };

    const verifyOtp = () => {
        if (localStorage.getItem('otp') === inputOtp) {
            alert('OTP verified');
        } else {
            alert('OTP not verified');
        }
    };

    if (!user) return <div>Loading...</div>;
    return (
        // Edit Home
        <div>
            <NavBar />
            <div className="SectionHolder">
                <section className="Section">
                    <h3 className="SectionTitleDashboard">
                        <span>
                            <a href="/vehicles">Profile</a>
                        </span>{' '}
                        {'>'} <span>Profile Update</span>
                    </h3>
                    <div className="SectionStepper">
                        <Button variant="text" className={stepper === 1 ? 'active' : ''} onClick={() => setStepper(1)}>
                            General Information
                        </Button>
                    </div>
                    <div className="SectionContent">
                        <form onSubmit={Submit} className="Form">
                            <div className="Input__Wrapper2">
                                <TextField
                                    required
                                    fullWidth
                                    label="First Name"
                                    defaultValue={user_id['user'].name.firstName}
                                    variant="filled"
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Last Name"
                                    defaultValue={user_id['user'].name.lastName}
                                    variant="filled"
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                />
                            </div>
                            <div className="Input__Wrapper2">
                                <div className="FormWrapper__2__1">
                                    <TextField
                                        required
                                        fullWidth
                                        label="Email"
                                        defaultValue={user.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        variant="filled"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            sendVerification();
                                            setOtpStatus(true);
                                        }}
                                    >
                                        Send Code
                                    </Button>
                                </div>

                                <div className="FormWrapper__2__1">
                                    {otpStatus ? (
                                        <>
                                            <TextField required fullWidth label="OTP CODE" variant="filled" onChange={(e) => setInputOtp(e.target.value)} />
                                            <Button variant="contained" onClick={() => verifyOtp()}>
                                                Verify
                                            </Button>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                            <div className="Input__Wrapper2">
                                <TextField
                                    required
                                    fullWidth
                                    label="New Password"
                                    variant="filled"
                                    type="password"
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    variant="filled"
                                    type="password"
                                    onChange={(e) => setForm({ ...form, confirmPass: e.target.value })}
                                />
                            </div>
                            <div className="Form__Button">
                                <Button variant="text" href="/profile">
                                    Cancel
                                </Button>
                                <Button variant="contained" type="submit" className="Submit">
                                    Submit
                                </Button>
                            </div>
                            {/* <button type="submit">Submit</button> */}
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
