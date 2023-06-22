import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:4000',
    baseURL: process.env.REACT_APP_API_URL
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

        //   const role = axiosInstance.get(`roles`)
        //   localStorage.setItem('role', JSON.stringify(role))
        //   console.log(localStorage.getItem('role'))

let shouldRunFunction = true;

async function getData() {
    try {
      const role = await axiosInstance.get(`roles`).then((res)=>{return res.data})
      localStorage.setItem('role', JSON.stringify(role))
      return role;
    } catch (error) {
      console.error(error);
    }
}

window.addEventListener('beforeunload', async (event) => {
  if (shouldRunFunction) {
    try{
        await console.log(getData())
    } catch(err) {
        console.log(err)
    }
        // localStorage.setItem('role', JSON.stringify(role))
        // console.log(localStorage.getItem('role'))
    console.log('Function ran on page refresh');
  }
});

axiosInstance.interceptors.request.use(
  config => {
    
    shouldRunFunction = true; // Set to true before each API call
    return config;
  },
  error => {
    shouldRunFunction = false; // Set to false to avoid running function on API calls
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    shouldRunFunction = false; // Set to false after each successful API call
    return response;
  },
  error => {
    shouldRunFunction = false; // Set to false to avoid running function on API calls
    return Promise.reject(error);
  }
);

export default axiosInstance;