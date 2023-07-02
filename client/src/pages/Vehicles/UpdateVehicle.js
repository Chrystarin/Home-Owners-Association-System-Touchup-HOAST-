import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import image from '../../images/Placeholder/QRcode.png';

import axios from '../../utils/axios';

function AddVehicle() {
    const navigate = useNavigate();

    const { id } = useParams();
    const [vehicle, setVehicle] = useState();
    const [stepper, setStepper] = useState(1);

    const [frontImage, setFrontImage] = useState();
    const [backImage, setBackImage] = useState();

    const [form, setForm] = useState({
        plateNumber: '',
        model: '',
        brand: '',
        type: '',
        color: ''
    });

    useEffect(() => {
        const fetchVehicle = async () => {
            await axios.get(`vehicles`, { params: { plateNumber: id } }).then((response) => {
                setVehicle(response.data);
                console.log(response.data);
                console.log(response.data.plateNumber);
            });
        };
        fetchVehicle();
    }, []);

    // Retrieves data from text input then assigns to form
    function updateForm(e) {
        return setForm((prev) => {
            const [key, value] = Object.entries(e)[0];
            prev[key] = value;
            return prev;
        });
    }

    // Submit button for login
    async function Submit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('frontImage', frontImage);
        formData.append('backImage', backImage);
        formData.append('plateNumber', vehicle?.plateNumber);
        formData.append('color', form.color || vehicle?.color);

        try {
            // Login
            await axios
                .patch(`vehicles`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                .then((response) => {
                    console.log(JSON.stringify(response?.data));
                    navigate('/vehicles');
                });
        } catch (err) {
            console.error(err);
            alert('Check your inputs!');
        }
    }

    function Stepper() {
        switch (stepper) {
            case 1:
                return (
                    <>
                        <form onSubmit={Submit} className="Form">
                            <TextField required fullWidth label="Plate Number" variant="filled" defaultValue={vehicle?.plateNumber} disabled />
                            <div className="FormWrapper__2">
                                <TextField required fullWidth label="Model" variant="filled" defaultValue={vehicle?.model} disabled />
                                <TextField required fullWidth label="Brand" variant="filled" defaultValue={vehicle?.brand} disabled />
                            </div>
                            <div className="FormWrapper__2">
                                <TextField required fullWidth label="Type" variant="filled" defaultValue={vehicle?.type} disabled />
                                <TextField
                                    required
                                    fullWidth
                                    label="Color"
                                    variant="filled"
                                    defaultValue={vehicle?.color}
                                    onChange={(e) => updateForm({ color: e.target.value })}
                                />
                            </div>

                            {!frontImage ? (
                                <div className="FormWrapper__2">
                                    <div className="UploadDocument__Holder">
                                        <input
                                            className="UploadDocument__Input"
                                            accept="image/png, image/jpeg"
                                            type="file"
                                            name=""
                                            id="upload"
                                            required
                                            onChange={(e) => setFrontImage(e.target.files[0])}
                                        />

                                        <label htmlFor="upload" className="UploadDocument__Holder" style={{ width: '300px' }}>
                                            <div className="UploadDocumentInput__Container">
                                                <h6>Upload front picture of the vehicle</h6>
                                                <p>Make sure the plate number is visible</p>
                                            </div>
                                        </label>
                                        <br />
                                        <img src="" alt="" />
                                    </div>
                                    <div></div>
                                </div>
                            ) : (
                                <img src={URL.createObjectURL(frontImage)} alt="" />
                            )}

                            {!backImage ? (
                                <div className="FormWrapper__2">
                                    <div className="UploadDocument__Holder">
                                        <input
                                            className="UploadDocument__Input"
                                            accept="image/png, image/jpeg"
                                            type="file"
                                            name=""
                                            id="upload"
                                            required
                                            onChange={(e) => setBackImage(e.target.files[0])}
                                        />

                                        <label htmlFor="upload" className="UploadDocument__Holder" style={{ width: '300px' }}>
                                            <div className="UploadDocumentInput__Container">
                                                <h6>Upload back picture of the vehicle</h6>
                                                <p>Make sure the plate number is visible</p>
                                            </div>
                                        </label>
                                        <br />
                                        <img src="" alt="" />
                                    </div>
                                    <div></div>
                                </div>
                            ) : (
                                <img src={URL.createObjectURL(backImage)} alt="" />
                            )}

                            {/* <div className='FormWrapper__2'>
                            <div className='UploadDocument__Holder'>
                                    <input className='UploadDocument__Input' type="file" name="" id="upload" required/>
                                    <label htmlFor='upload' className='UploadDocument__Holder'  style={{width:"300px"}}>
                                        <div className='UploadDocumentInput__Container'>
                                            <h6>Upload picture of the vehicle</h6>
                                            <p>Make sure the plate number is visible</p>
                                        </div>
                                    </label>
                                <br />
                                <img src="" alt="" />
                            </div>
                            <div></div>
                        </div> */}
                            <div className="Form__Button">
                                <Button variant="text">Cancel</Button>
                                <Button variant="contained" type="submit" className="Submit">
                                    Update
                                </Button>
                            </div>
                        </form>
                    </>
                );
                break;
            default:
                break;
        }
    }
    return (
        <>
            <Navbar type="vehicle" />
            <div className="SectionHolder">
                <section className="Section">
                    <h3 className="SectionTitleDashboard">
                        <span>
                            <a href="/vehicles">Vehicles</a>
                        </span>{' '}
                        > <span>Vehicle Form</span>
                    </h3>

                    <div className="SectionStepper">
                        <Button variant="text" className={stepper === 1 ? 'active' : ''} onClick={() => setStepper(1)}>
                            General Information
                        </Button>
                    </div>
                    <div className="SectionContent">
                        <Stepper />
                    </div>
                </section>
            </div>
        </>
    );
}

export default AddVehicle;
