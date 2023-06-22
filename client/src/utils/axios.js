import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

export default axios.create({
	baseURL,
	withCredentials: true,
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}
});
