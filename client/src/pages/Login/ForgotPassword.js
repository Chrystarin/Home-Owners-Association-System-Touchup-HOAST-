import React, { useState } from 'react';
import axios from '../../utils/axios';

import HouseImg from '../../images/House.png';
import Header from '../../layouts/Header';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useAuth } from '../../utils/AuthContext.js';

export default function UpadtePassword() {
	// Contains login input
	const [form, setForm] = useState({
		email: '',
		password: ''
	});

	const [btnState, setBtnState] = useState(true);
	const [sendCodeBtn, setSendCodeBtn] = useState(false);
	const [verifyBtn, setVeryfyBtn] = useState(true);
	const [enterBtn, setEnterBtn] = useState(true);

	const [emailError, setEmailError] = useState('');
	const [inputOtp, setInputOtp] = useState();

	// Retrieves data from text input then assigns to form
	function updateForm(e) {
		return setForm((prev) => {
			const [key, value] = Object.entries(e)[0];
			prev[key] = value;
			return prev;
		});
	}

	async function Submit(e) {
		e.preventDefault();
		try {
			await axios
				.patch(
					`users/forgot`,
					JSON.stringify({
                        email: form.email,
						password: form.password
					})
				)
				.then((response) => {
					alert('Password Updated Successfully!');
					window.location.href = '/login';
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

		localStorage.setItem('otp', OTP);
	};

	const sendVerification = async () => {
		generateOTP();
		try {
			await axios
				.post('users/verify', {
					email: form.email,
					message:
						'Your OTP for your Email verification is ' +
						localStorage.getItem('otp') +
						'.'
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
			setBtnState(false);
			alert('OTP verified');

			localStorage.removeItem('otp');
		} else {
			alert('OTP not verified');
		}
	};

	return (
		<div>
			<Header />
			<div className="SectionHolder">
				<section
					className="Section"
					id="Login"
				>
					<div id="Login__Img">
						<img
							src={HouseImg}
							alt=""
						/>
					</div>
					<div id="Login__Container">
						<h2 className="Title">Forgot Password</h2>
						<div className="Login__Form">
							<div className="FormReplacement">
								<TextField
									label="Email"
									type="email"
									autoComplete="current-password"
									variant="filled"
									onChange={(e) =>
										updateForm({ email: e.target.value })
									}
									error={!!emailError}
									helperText={emailError}
								/>
								<TextField
									id="filled-password-input"
									label="Code"
									type="text"
									InputProps={{ maxLength: 6 }}
									autoComplete="current-password"
									variant="filled"
									onChange={(e) =>
										setInputOtp(e.target.value)
									}
								/>

								<TextField
									disabled={btnState}
									id="filled-password-input"
									label="New Password"
									type="password"
									autoComplete="current-password"
									variant="filled"
									onChange={(e) =>
										updateForm({ password: e.target.value })
									}
								/>
								<div>
									<Button
										disabled={sendCodeBtn}
										variant="contained"
										size="large"
										onClick={() => {
											sendVerification();
											setVeryfyBtn(false);
										}}
									>
										Send Code
									</Button>
									<Button
										disabled={verifyBtn}
										variant="contained"
										size="large"
										onClick={() => {
											verifyOtp();
											setEnterBtn(false);
										}}
									>
										Verify
									</Button>

									<Button
										disabled={enterBtn}
										variant="contained"
										size="large"
										type='submit'
									>
										Enter
									</Button>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
