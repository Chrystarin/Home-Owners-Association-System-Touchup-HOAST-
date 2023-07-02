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

    const [form, setForm] = useState({
        userId: '',
        hoaId: localStorage.getItem('hoaId')
    });

    const [accForm, setAccForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
        contact: ''
	});


    const [openSnackBar, setOpenSnackBar] = React.useState({
        open:false,
        type:"",
        note:""
    });

    const [stepper, setStepper] = useState(1);


    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let generatedPassword = '';
    
        for (let i = 0; i < 8; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          generatedPassword += chars[randomIndex];
        }
    
        return generatedPassword;
      };

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
                    hoaId: form.hoaId,
                    contactNo: accForm.contact
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

    async function SubmitAccount(e){
        e.preventDefault();
        let password = generatePassword();
        try{
            await axios
				.post(`users/signup`,{
                    firstName: accForm.firstName,
                    lastName: accForm.lastName,
                    email: accForm.email,
                    password: password
                }
				)
				.then((response) => {
					console.log(response.data)
                    console.log(response.data.userId)
                    const addGuard = async () => {
                        try{
                            await axios
                                .post(
                                    `/hoas/guards`,
                                    JSON.stringify({ 
                                        userId: response.data.userId,
                                        hoa: form.hoaId,
                                        hoaId: form.hoaId
                                    })
                                )
                                .then((response) => {
                                    const sendMail = async () => {
                                        try {
                                            await axios.post('users/verify', {
                                                email: accForm.email,
                                                message:
                                                    'Your Account has been created for the HOAST Website. Below are your account credentials \n Upon login, please change your password. \n' +
                                                    'Email: ' +
                                                    accForm.email +
                                                    '\nPassword: ' +
                                                    password +
                                                    "\n P.S Don't share this to anyone"
                                            });
                                
                                            return 'Email sent successfully to ' + accForm.email;
                                        }
                                        catch(err){
                                            setOpenSnackBar(openSnackBar => ({
                                                ...openSnackBar,
                                                open:true,
                                                type:'error',
                                                note:"Didn't Send Email!",
                                            }));
                                            console.error(err.message);
                                        }
                                    }
                                    sendMail();
                                    console.log(password);
                                    navigate("/guard");
                                })
                        } catch (error) {
                            setOpenSnackBar(openSnackBar => ({
                                ...openSnackBar,
                                open:true,
                                type:'error',
                                note:"Check Email!",
                            }));
                        }
                    }
                    addGuard();
				});
        }
        catch(err){
            setOpenSnackBar(openSnackBar => ({
                ...openSnackBar,
                open:true,
                type:'error',
                note:"Check your Inputs!",
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
                    <div > 
                        <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>Add Existing Guard</Button>
                        <Button variant='text' className={(stepper === 2)?"active":""} onClick={()=> setStepper(2)}>Create Guard Account</Button>
                    </div>
                        {stepper===1 ?<>
                            <form onSubmit={Submit} className='Form'>
                                <TextField
                                    id="filled-password-input"
                                    label="User ID"
                                    type="text"
                                    autoComplete="current-password"
                                    variant="filled"
                                    required
                                    onChange={(e)=>updateForm({ userId: e.target.value })}
                                />
                                <div className='Form__Button'>
                                    <Button variant='text' onClick={()=> navigate("/guard")}>cancel</Button>
                                    <Button variant='contained' type='submit' className='Submit'>Submit</Button>
                                </div>
                            </form>
                        </> :<></>}
                        {stepper===2 ?<>
                            <form onSubmit={SubmitAccount} className='Form'>
                                <TextField
                                    id="filled-password-input"
                                    label="First Name"
                                    type="text"
                                    variant="filled"
                                    required
                                    onChange={(e)=>setAccForm({...accForm, firstName: e.target.value })}
                                />
                                <TextField
                                    id="filled-password-input"
                                    label="Last Name"
                                    type="text"
                                    variant="filled"
                                    required
                                    onChange={(e)=>setAccForm({...accForm, lastName: e.target.value })}
                                />
                                <TextField
                                    id="filled-password-input"
                                    label="Email"
                                    type="text"
                                    variant="filled"
                                    required
                                    onChange={(e)=>setAccForm({...accForm, email: e.target.value })}
                                />
                                <TextField
                                    id="filled-password-input"
                                    label="Contact No."
                                    type="text"
                                    variant="filled"
                                    required
                                    inputProps={{ maxLength: 11 }}
                                    onChange={(e)=>setAccForm({...accForm, contact: e.target.value })}
                                />
                                
                                <div className='Form__Button'>
                                    <Button variant='text' onClick={()=> navigate("/guard")}>cancel</Button>
                                    <Button variant='contained' type='submit' className='Submit'>Submit</Button>
                                </div>
                            </form>
                        </> :<></>}
                        
                    </div>
                </div>
            </section>
            <SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/>
        </div>
    </>
}
