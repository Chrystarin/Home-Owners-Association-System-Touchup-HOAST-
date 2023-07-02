import React, { useEffect, useState } from 'react';
import './EditHome.scss';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../utils/AuthContext.js';
import Navbar from '../../layouts/NavBar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ResidentCard from '../../components/ResidentCard/ResidentCard';
import { useNavigate } from 'react-router';
import SearchInput from '../../components/SearchInput/SearchInput';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function EditHome() {
    const { id } = useParams();
    const { isHomeowner } = useAuth();

    const [name, setName] = useState();
    const [color, setColor] = useState();
    const [contactNumber, setContactNumber] = useState();
    const [home, setHome] = useState();
    const [residents, setResidents] = useState();
    const [residentAdd, setResidentAdd] = useState();
    const [openSnackBar, setOpenSnackBar] = React.useState({
        open: false,
        type: '',
        note: ''
    });
    const navigate = useNavigate();
    const [accForm, setAccForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        residentType: ''
    });

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let generatedPassword = '';

        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            generatedPassword += chars[randomIndex];
        }

        return generatedPassword;
    };

    // Retrieve Home Info
    const fetchHome = async () => {
        await axios
            .get(`homes`, {
                params: {
                    homeId: id
                }
            })
            .then((response) => {
                console.log(response.data);
                setHome(response.data);
                let [owner, ...reds] = response.data.residents;
                setResidents(reds);
                console.log(residents);
            });
    };

    async function Submit(e) {
        e.preventDefault();
        try {
            await axios
                .patch(
                    `homes`,
                    JSON.stringify({
                        name: name,
                        color: color,
                        contactNumber: contactNumber,
                        homeId: id
                    })
                )
                .then((response) => {
                    console.log(response.data);
                });
        } catch (err) {}
        navigate('/homes');
    }

    async function AddResident(e) {
        e.preventDefault();
        try {
            await axios
                .post(
                    `residents`,
                    JSON.stringify({
                        homeId: id,
                        firstName: accForm.firstName,
                        lastName: accForm.lastName,
                        residentType: accForm.residentType,
                        email: accForm.email
                    })
                )
                .then((response) => {
                    console.log('Email: ' + accForm.email + ' Password: ' + response.data.residentPassword);
                    setOpenSnackBar((openSnackBar) => ({
                        ...openSnackBar,
                        open: true,
                        type: 'success',
                        note: 'Resident Added'
                    }));
                    const sendMail = async () => {
                        try {
                            await axios.post('users/verify', {
                                email: accForm.email,
                                message:
                                    'Your Resident Account has been created for the HOAST Website. Below are your account credentials \n Upon login, please change your password. \n' +
                                    'Email: ' +
                                    accForm.email +
                                    '\nPassword: ' +
                                    response.data.residentPassword +
                                    "\n Note: Don't share this to anyone"
                            });

                            return 'Email sent successfully to ' + accForm.email;
                        } catch (err) {
                            setOpenSnackBar((openSnackBar) => ({
                                ...openSnackBar,
                                open: true,
                                type: 'error',
                                note: "Didn't Send Email!"
                            }));
                            console.error(err.message);
                        }
                    };
                    sendMail();

                    fetchHome();
                });
        } catch (err) {
            setOpenSnackBar((openSnackBar) => ({
                ...openSnackBar,
                open: true,
                type: 'error',
                note: 'Resident exist on the list'
            }));
        }
    }

    async function RemoveResident(residentId) {
        console.log(id);
        try {
            await axios
                .patch(
                    `residents`,
                    JSON.stringify({
                        residentId: residentId,
                        homeId: id
                    })
                )
                .then((response) => {
                    setOpenSnackBar((openSnackBar) => ({
                        ...openSnackBar,
                        open: true,
                        type: 'error',
                        note: 'Resident Removed'
                    }));

                    fetchHome();
                });
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchHome();
    }, []);

    if (!home || !residents) return <div>Loading...</div>;

    return (
        <div>
            <Navbar type="home" />
            <div className="SectionHolder">
                <section className="Section">
                    <h3 className="SectionTitleDashboard">Edit Home</h3>
                    <div className="SectionContent" id="ViewHome">
                        <div className="Form" id="ViewHome__Content">
                            <div className="EditHome">
                                <TextField
                                    className="EditHome__Name"
                                    id="filled-password-input"
                                    label="Name"
                                    type="text"
                                    autoComplete="current-password"
                                    variant="filled"
                                    defaultValue={home.name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField
                                    className="EditHome__Name"
                                    id="filled-password-input"
                                    label="Color"
                                    type="text"
                                    autoComplete="current-password"
                                    variant="filled"
                                    defaultValue={home.color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                                <TextField
                                    className="EditHome__Name"
                                    id="filled-password-input"
                                    label="Contact Number"
                                    type="text"
                                    autoComplete="current-password"
                                    variant="filled"
                                    defaultValue={home.conactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                                <div className="EditHome__ResidentList">
                                    <h5>List of Residents</h5>
                                    <div className="FormWrapper__2__1">
                                        {/* <TextField
                                                id="filled-password-input"
                                                label="Residents ID"
                                                type="text"
                                                autoComplete="current-password"
                                                variant="filled"
                                                onChange={(e)=>setResidentAdd(e.target.value)}
                                            />
                                        <Button variant="contained"  type='submit' onClick={AddResident}>
                                            Add
                                        </Button> */}
                                        <form onSubmit={AddResident} className="Form">
                                            <TextField
                                                id="filled-password-input"
                                                label="First Name"
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) => setAccForm({ ...accForm, firstName: e.target.value })}
                                            />
                                            <TextField
                                                id="filled-password-input"
                                                label="Last Name"
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) => setAccForm({ ...accForm, lastName: e.target.value })}
                                            />
                                            <TextField
                                                id="filled-password-input"
                                                label="Email"
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) => setAccForm({ ...accForm, email: e.target.value })}
                                            />
                                            <FormControl required variant="outlined" fullWidth>
                                                <InputLabel id="home-select">Resident Type</InputLabel>
                                                <Select
                                                    labelId="home-select"
                                                    value={accForm.residentType}
                                                    label="Home"
                                                    onChange={(e) => setAccForm({ ...accForm, residentType: e.target.value })}
                                                >
                                                    <MenuItem value={'family'}>Family Member</MenuItem>
                                                    <MenuItem value={'household'}>Household Member</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <div className="Form__Button">
                                                <Button variant="contained" type="submit" className="Submit">
                                                    Add Resident
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                    <div>
                                        {residents.length === 0 ? (
                                            <p>No Residents Available!</p>
                                        ) : (
                                            <>
                                                <h6>List of Residents</h6>
                                                <br />
                                                <div className="ResidentListWrapper">
                                                    {residents.length > 0 &&
                                                        residents.map((resident) => {
                                                            if (resident.status == 'active')
                                                                return (
                                                                    // <p>{JSON.stringify(resident.user.name.firstName)}</p>
                                                                    <ResidentCard
                                                                        key={resident._id}
                                                                        username={resident.user.name.firstName + ' ' + resident.user.name.lastName}
                                                                        type="Edit"
                                                                        action={() => RemoveResident(resident.user.userId)}
                                                                    />
                                                                );
                                                        })}
                                                </div>
                                                <br />
                                                <hr />
                                                <br />
                                                <h6>Removed Residents</h6>
                                                <br />
                                                <div className="ResidentListWrapper">
                                                    {residents.length > 0 &&
                                                        residents.map((resident) => {
                                                            if (resident.status == 'inactive')
                                                                return (
                                                                    // <p>{JSON.stringify(resident.user.name.firstName)}</p>
                                                                    <ResidentCard
                                                                        key={resident._id}
                                                                        username={resident.user.name.firstName + ' ' + resident.user.name.lastName}
                                                                        type="View"
                                                                        action={() => RemoveResident(resident.user.userId)}
                                                                    />
                                                                );
                                                        })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="Form__Button">
                                <Button variant="contained" size="large" type="submit" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button variant="contained" size="large" type="submit" onClick={Submit}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <SnackbarComp open={openSnackBar} setter={setOpenSnackBar} />
        </div>
    );
}

export default EditHome;
