import React, { useRef, useState } from 'react';

import './Register.scss';

import HouseImg from '../../images/House.png';
import Header from '../../layouts/Header';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import axios from '../../utils/axios';

import { useNavigate } from 'react-router';

function Register() {
	const navigate = useNavigate();

	const [registerForm, setRegisterForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: ''
	});

	// Retrieves data from text input then assigns to form
	function updateForm(e) {
		return setRegisterForm((prev) => {
			const [key, value] = Object.entries(e)[0];
			prev[key] = value;
			console.log(registerForm);
			return prev;
		});
	}

	// Submit function for register
	async function Submit(e) {
		e.preventDefault();

		try {
			// API call for user signup
			await axios
				.post(
					`users/signup`,
					JSON.stringify({
						firstName: registerForm.firstName,
						lastName: registerForm.lastName,
						email: registerForm.email,
						password: registerForm.password
					}),
					{
						headers: { 'Content-Type': 'application/json' }
					}
				)
				.then((response) => {
					alert('Registered Successfully!');
					navigate('/');
				});
		} catch (err) {
			console.error(err.message);
		}
	}

	return (
		<div>
			<Header />
			<div className="SectionHolder">
				<section
					className="Section"
					id="Register"
				>
					<div id="Register__Img">
						<img
							src={HouseImg}
							alt=""
						/>
					</div>
					<div id="Register__Container">
						<h2 className="Title">REGISTER</h2>
						<div className="Register__Form">
							<form onSubmit={Submit}>
								<div className="Input__Wrapper2">
									<TextField
										required
										id="filled-password-input"
										label="First Name"
										type="text"
										autoComplete="current-password"
										variant="filled"
										onChange={(e) =>
											updateForm({
												firstName: e.target.value
											})
										}
										inputProps={{
											pattern: '^[a-zA-Z\\s]*$'
										}}
									/>
									<TextField
										required
										id="filled-password-input"
										label="Last Name"
										type="text"
										autoComplete="current-password"
										variant="filled"
										onChange={(e) =>
											updateForm({
												lastName: e.target.value
											})
										}
										inputProps={{
											pattern: '^[a-zA-Z\\s]*$'
										}}
									/>
								</div>
								<TextField
									required
									id="filled-password-input"
									label="Email"
									type="email"
									autoComplete="current-password"
									variant="filled"
									onChange={(e) =>
										updateForm({ email: e.target.value })
									}
								/>
								<TextField
									required
									id="filled-password-input"
									label="Password"
									type="password"
									autoComplete="current-password"
									variant="filled"
									onChange={(e) =>updateForm({ password: e.target.value })}
									inputProps={{ pattern:"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" }} 
                                    // Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters
								/>
								<div>
									<Button
										variant="contained"
										size="large"
										type="submit"
									>
										Register
									</Button>
								</div>
							</form>
							<p id="Register__Note">
								Already a member? <a href="/login">Login</a>{' '}
								now!
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default Register;
