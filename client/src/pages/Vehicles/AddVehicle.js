import React, { useState } from 'react';

import { useNavigate } from 'react-router';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import NativeSelect from '@mui/material/NativeSelect';
import image from '../../images/Placeholder/QRcode.png';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';
import axios from './../../utils/axios';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function AddVehicle() {
	const navigate = useNavigate();
	const [openSnackBar, setOpenSnackBar] = React.useState({
		open: false,
		type: '',
		note: ''
	});
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

	const [cartype, setCarType] = React.useState('');

	const handleChange = (event: SelectChangeEvent) => {
		setCarType(event.target.value);
	};

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
		formData.append('plateNumber', form.plateNumber);
		formData.append('model', form.model);
		formData.append('brand', form.brand);
		formData.append('type', form.type);
		formData.append('color', form.color);

		try {
			// Login
			await axios
				.post(`vehicles`, formData, {
					headers: { 'Content-Type': 'multipart/form-data' }
				})
				.then((response) => {
					console.log(JSON.stringify(response?.data));
					alert('Registered Successfully!');
					navigate('/vehicles');
				});
		} catch (err) {
			console.error(err);
		}
	}

	const carTypes = [
		'Sedan',
		'SUV',
		'CUV',
		'Van',
		'Truck',
		'Motorcycle',
		'Micro',
		'Hatchback',
		'Jeep',
		'Wagon',
		'Pick-Up',
		'Mini Van',
		'Coupe',
		'Crossover',
		'Sport Car',
		'Super Car'
	];

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
						<Button
							variant="text"
							className={stepper === 1 ? 'active' : ''}
							onClick={() => setStepper(1)}
						>
							General Information
						</Button>
					</div>
					<div className="SectionContent">
						<form
							onSubmit={Submit}
							className="Form"
						>
							<TextField
								required
								fullWidth
								label="Plate Number"
								variant="filled"
								onChange={(e) =>
									updateForm({ plateNumber: e.target.value })
								}
							/>
							<div className="FormWrapper__2">
								<TextField
									required
									fullWidth
									label="Model"
									variant="filled"
									onChange={(e) =>
										updateForm({ model: e.target.value })
									}
								/>
								<TextField
									required
									fullWidth
									label="Brand"
									variant="filled"
									onChange={(e) =>
										updateForm({ brand: e.target.value })
									}
								/>
							</div>
							<div className="FormWrapper__2">
								{/* <TextField fullWidth  label="Type" variant="filled" onChange={(e)=>updateForm({ type: e.target.value })}/> */}
								{/* <NativeSelect defaultValue={null} label="Type" inputProps={{ name: 'age', id: 'uncontrolled-native', }} onChange={(e)=>updateForm({ type: e.target.value })}>
                                <option aria-label="None" value="Types" />
                                {carTypes.map((type, index) => {
                                    return <option key={index} value={type}>{type}</option>
                                })}
                            </NativeSelect> */}
								<FormControl
                                    maxWidth
									variant="filled"
									sx={{ m: 1, minWidth: 120 }}
								>
									<InputLabel id="demo-simple-select-filled-label">
										Type
									</InputLabel>
									<Select
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										value={cartype}
										onChange={(e) => {
											setCarType(e.target.value);
											updateForm({
												type: e.target.value
											});
										}}
									>
										<MenuItem value="">
											<em>None</em>
										</MenuItem>
										{carTypes.map((type, index) => {
											return (
												<MenuItem
													key={index}
													value={type}
												>
													{type}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
								{/* <TextField required fullWidth label="Type" variant="filled" onChange={(e)=>updateForm({ type: e.target.value })}/> */}
								<TextField
									required
									fullWidth
									label="Color"
									variant="filled"
									onChange={(e) =>
										updateForm({ color: e.target.value })
									}
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
											onChange={(e) =>
												setFrontImage(e.target.files[0])
											}
										/>

										<label
											htmlFor="upload"
											className="UploadDocument__Holder"
											style={{ width: '300px' }}
										>
											<div className="UploadDocumentInput__Container">
												<h6>
													Upload front picture of the
													vehicle
												</h6>
												<p>
													Make sure the plate number
													is visible
												</p>
											</div>
										</label>
										<br />
										<img
											src=""
											alt=""
										/>
									</div>
									<div></div>
								</div>
							) : (
								<img
									src={URL.createObjectURL(frontImage)}
									alt=""
								/>
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
											onChange={(e) =>
												setBackImage(e.target.files[0])
											}
										/>

										<label
											htmlFor="upload"
											className="UploadDocument__Holder"
											style={{ width: '300px' }}
										>
											<div className="UploadDocumentInput__Container">
												<h6>
													Upload back picture of the
													vehicle
												</h6>
												<p>
													Make sure the plate number
													is visible
												</p>
											</div>
										</label>
										<br />
										<img
											src=""
											alt=""
										/>
									</div>
									<div></div>
								</div>
							) : (
								<img
									src={URL.createObjectURL(backImage)}
									alt=""
								/>
							)}

							<div className="Form__Button">
								<Button variant="text">Cancel</Button>
								<Button
									variant="contained"
									type="submit"
									className="Submit"
								>
									Submit
								</Button>
							</div>
						</form>
					</div>
				</section>
				<SnackbarComp
					open={openSnackBar}
					setter={setOpenSnackBar}
				/>
			</div>
		</>
	);
}

export default AddVehicle;
