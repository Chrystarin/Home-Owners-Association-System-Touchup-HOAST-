import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import Navbar from '../../layouts/NavBar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchInput from '../../components/SearchInput/SearchInput';
import axios from '../../utils/axios';
import SideBar from './SideBar';
import SnackbarComp from '../../components/SnackBar/SnackbarComp.js';
export default function AddHomeowner() {
    const navigate = useNavigate();

    const [stepper, setStepper] = useState(1);

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

    const [csvFile, setCsvFile] = useState();

    const [openSnackBar, setOpenSnackBar] = React.useState({
        open: false,
        type: '',
        note: ''
    });

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            console.log(form);
            return prev;
        });
    }

    // Submit button for adding guard
    async function Submit(e) {
        e.preventDefault();
        console.log(form);
        try {
            await axios
                .post(`/users/homeowner`, {
                    hoaId: localStorage.getItem('hoaId'),
                    resident: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email
                    },
                    home: {
                        homeNo: form.homeNo,
                        street: form.street,
                        phase: form.phase,
                        contactNo: form.contactNo
                    }
                })
                .then((response) => {
                    setOpenSnackBar((openSnackBar) => ({
                        ...openSnackBar,
                        open: true,
                        type: 'success',
                        note: 'Added Homeowner Succesfully!'
                    }));
                    console.log(`Email: ${form.email} Password: ${response.data.credentials.password}`);
                    navigate('/residentslist');
                });
        } catch (error) {
            setOpenSnackBar((openSnackBar) => ({
                ...openSnackBar,
                open: true,
                type: 'error',
                note: error?.response?.data?.message ?? 'Check Your input!'
            }));
            console.error(error.response.data.message);
        }
    }

    async function SubmitMultiple(e) {
        e.preventDefault();

        try {
            UploadCSV(csvFile);
            setOpenSnackBar((openSnackBar) => ({
                ...openSnackBar,
                open: true,
                type: 'success',
                note: ' Homeowners Added Succesfully!'
            }));
            navigate('/residentslist');
        } catch (error) {
            setOpenSnackBar((openSnackBar) => ({
                ...openSnackBar,
                open: true,
                type: 'error',
                note: error?.response?.data?.message ?? 'Homeowner Already Exists!'
            }));
            console.error(error.response.data.message);
        }
    }

    const sendUserCredential = async ({ email, password }) => {
        try {
            await axios.post('users/verify', {
                email: email,
                message:
                    'Your Account has been created for the HOAST Website. Below are your account credentials \n Upon login, please change your password. \n' +
                    'Email: ' +
                    email +
                    '\nPassword: ' +
                    password +
                    "\n P.S Don't share this to anyone"
            });

            return 'Email sent successfully to ' + email;
        } catch (error) {
            return error;
        }
    };

    const UploadCSV = (data) => {
        var reader = new FileReader();

        reader.readAsText(data);
        // console.log(reader.readAsText(data));

        // Reads the CSV file and Generate HTML
        reader.onload = async () => {
            // Entire CSV file
            let csv = reader.result;

            // Split into Rows
            let [head, ...rows] = csv.split('\n');

            head = ['firstName', 'lastName', 'email', 'name', 'homeNo', 'street', 'phase', 'contactNo'];
            const accounts = [];

            console.log(rows);

            // Objects
            rows.forEach((row) => {
                const subData = {};
                columner(row)?.forEach((col, i) => {
                    subData[head[i]] = col.replace('\r', '');
                });
                accounts.push(subData);
            });

            Promise.allSettled(
                accounts.map((account) =>
                    axios.post('users/homeowner', {
                        hoaId: localStorage.getItem('hoaId'),
                        resident: {
                            firstName: account.firstName,
                            lastName: account.lastName,
                            email: account.email
                        },
                        home: {
                            homeNo: account.homeNo,
                            name: account.name,
                            street: account.street,
                            phase: account.phase,
                            contactNo: account.contactNo
                        }
                    })
                )
            )
                .then((responses) => {
                    responses.filter(({ status }) => status === 'rejected').forEach(console.log);

                    return Promise.allSettled(responses.filter(({ status }) => status === 'fulfilled').map(({ value }) => sendUserCredential(value.data.credentials)));
                })
                .then((responses) => {
                    responses.forEach((response) => console.log(response.value || response.reason));
                })
                .catch(console.error);

            // responses
            // 	.filter(({ status }) => status === 'fulfilled')
            // 	.forEach(({ value }) => sendUserCredential(value.data.credentials));
        };

        function columner(row) {
            return row.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g);
        }
        // };
    };

    return (
        <>
            <Navbar type="vehicle" />
            <div className="SectionHolder">
                <section className="Section SectionManage">
                    <SideBar active="ResidentsList" />
                    <div>
                        <h3 className="SectionTitleDashboard">
                            <span>Add Homeowner</span>
                        </h3>
                        <div>
                            <Button variant="text" className={stepper === 1 ? 'active' : ''} onClick={() => setStepper(1)}>
                                Single Homeowner
                            </Button>
                            <Button variant="text" className={stepper === 2 ? 'active' : ''} onClick={() => setStepper(2)}>
                                Multiple Homeowner
                            </Button>
                        </div>
                        {stepper === 1 ? (
                            <>
                                <div>
                                    <div className="SectionContent">
                                        <form onSubmit={Submit} className="Form">
                                            <h5>Homeowner</h5>
                                            <TextField
                                                id="filled-password-input"
                                                label="First Name"
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) =>
                                                    updateForm({
                                                        firstName: e.target.value
                                                    })
                                                }
                                            />
                                            <TextField
                                                id="filled-password-input"
                                                label="Last Name"
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) =>
                                                    updateForm({
                                                        lastName: e.target.value
                                                    })
                                                }
                                            />
                                            <TextField
                                                id="filled-password-input"
                                                label="Email"
                                                type="email"
                                                variant="filled"
                                                required
                                                onChange={(e) =>
                                                    updateForm({
                                                        email: e.target.value
                                                    })
                                                }
                                            />
                                            <TextField
                                                id="filled-password-input"
                                                label="Contact No."
                                                type="number"
                                                variant="filled"
                                                required
                                                inputProps={{ maxLength: 11 }}
                                                onChange={(e) =>
                                                    updateForm({
                                                        contactNo: e.target.value
                                                    })
                                                }
                                            />
                                            <h5>Home</h5>
                                            <TextField
                                                id="filled-password-input"
                                                label="Home No."
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) =>
                                                    updateForm({
                                                        homeNo: e.target.value
                                                    })
                                                }
                                            />
                                            <TextField
                                                id="filled-password-input"
                                                label="Street"
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) =>
                                                    updateForm({
                                                        street: e.target.value
                                                    })
                                                }
                                            />
                                            <TextField
                                                id="filled-password-input"
                                                label="Phase"
                                                type="text"
                                                variant="filled"
                                                required
                                                onChange={(e) =>
                                                    updateForm({
                                                        phase: e.target.value
                                                    })
                                                }
                                            />
                                            <div className="Form__Button">
                                                <Button variant="text" onClick={() => navigate('/residentslist')}>
                                                    Cancel
                                                </Button>
                                                <Button variant="contained" type="submit" className="Submit">
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                        {stepper === 2 ? (
                            <>
                                <div>
                                    <div className="SectionContent">
                                        <form onSubmit={SubmitMultiple} className="Form">
                                            <h5>Upload CSV File for Multiple Homeowners</h5>
                                            <input type="file" accept=".csv" id="picker" onChange={(e) => setCsvFile(e.target.files[0])} />
                                            <div className="Form__Button">
                                                <Button variant="text" onClick={() => navigate('/residentslist')}>
                                                    Cancel
                                                </Button>
                                                <Button variant="contained" type="submit" className="Submit">
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </section>
                <SnackbarComp open={openSnackBar} setter={setOpenSnackBar} />
            </div>
        </>
    );
}
