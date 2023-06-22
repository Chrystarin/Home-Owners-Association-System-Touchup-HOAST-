import React, { useState, useContext, useEffect } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Check if user is already logged in on first mount
		const loggedInUser = localStorage.getItem('user');
		if (loggedInUser) {
			setUser(JSON.parse(loggedInUser));
			fetchRole();
		}
	}, []);

	const login = async (email, password) => {
		try {
			await axios
				.post(
					'users/login',
					JSON.stringify({
						email: email,
						password: password
					})
				)
				.then((response) => {
					console.log(response);
					setUser(response.data);
					localStorage.setItem('user', JSON.stringify(response.data));
					const subFetchRole = async () => {
						await fetchRole();
					};
					subFetchRole();
					if (localStorage.getItem('guardOf')) {
						navigate('/scanner');
					} else {
						navigate('/homes');
					}
				});
		} catch (error) {
			alert(error.response.data.message);
		}
	};

	const logout = async () => {
		localStorage.clear();
		navigate('/');
	};

	const fetchRole = async () => {
		await axios.get(`roles`).then((response) => {
			// console.log(response.data)
			let roles = [];
			if (response.data.admin.length >= 1) {
				localStorage.setItem('hoaId', response.data.admin);
				localStorage.setItem('adminOf', response.data.admin);
				roles.push('admin');
			}
			if (response.data.guard.length >= 1) {
				localStorage.setItem('hoaId', response.data.guard);
				localStorage.setItem('guardOf', response.data.guard);
				roles.push('guard');
			}
			if (response.data.homeowner.length >= 1) {
				localStorage.setItem('homeownerOf', response.data.homeowner);
				roles.push('homeowner');
			}
			if (response.data.resident.length >= 1) {
				localStorage.setItem('residentOf', response.data.resident);
				roles.push('resident');
			}
			localStorage.setItem('roles', roles);
		});
	};

	// Function to check if user is authorized to access the page
	const isAuth = (id) => {
		if (!user) {
			// User is not logged in, so they are not authorized
			return false;
		}

		if (user.userId !== id) {
			// User is logged in, but they are not authorized
			return false;
		}

		// User is logged in and authorized
		return true;
	};

	const isAdmin = (id) => {
		const data = !localStorage.getItem('adminOf')
			? []
			: localStorage.getItem('adminOf');
		if (data == id) {
			return true;
		}
		return false;
	};

	const isGuard = (id) => {
		const data = !localStorage.getItem('guardOf')
			? []
			: localStorage.getItem('guardOf');
		if (data == id) {
			return true;
		}
		return false;
	};

	const isHomeowner = (id) => {
		const data = !localStorage.getItem('homeownerOf')
			? []
			: localStorage.getItem('homeownerOf').split(',');
		if (data.includes(id)) {
			return true;
		}
		return false;
	};

	const isResident = (id) => {
		const data = !localStorage.getItem('residentOf')
			? []
			: localStorage.getItem('residentOf').split(',');
		if (data.includes(id)) {
			return true;
		}
		return false;
	};

	const isRole = (id) => {
		const data = !localStorage.getItem('roles')
			? []
			: localStorage.getItem('roles').split(',');
		if (data.includes(id)) {
			return true;
		}
		return false;
	};

	const value = {
		user,
		login,
		logout,
		isAuth,
		isAdmin,
		isGuard,
		isHomeowner,
		isResident,
		isRole
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

function useAuth() {
	return useContext(AuthContext);
}

export { AuthProvider, useAuth };
