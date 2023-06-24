import React,{useState,useEffect} from 'react'
import Navbar from '../../layouts/NavBar';
import './../ResidentsView/ResidentsView.scss';
import Avatar from '@mui/material/Avatar';
import axios from '../../utils/axios';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import {useAuth} from './../../utils/AuthContext.js';
function GuardProfile() {
    const [guards, setGuards] = useState();
    const {isRole} = useAuth();

    // Runs onLoad
	useEffect(() => {
		const fetchGuards = async () => {
			await axios
				.get(`hoas/guards`, {
					params: {
						hoaId: localStorage.getItem('hoaId'),
                        hoaId: (isRole('admin') || isRole('guard')) ? localStorage.getItem('hoaId') : null
					}
				})
				.then((response) => {
                    console.log(response.data)
					setGuards(response.data)
				});
		};
        fetchGuards();
	}, []);

    if (!guards) return <div>Loading...</div>
    
    return <>
        <Navbar/>
        <div className='SectionHolder'>
            <section className='Section'>
            {/* <h3 className='SectionTitleDashboard'><span><a href="/homes">My Profile</a></span>  > <span>{user.name.firstName + " " + user.name.lastName}</span></h3> */}
                <div className='SectionContent SectionView' id='ViewResident'>
                    <div className='SectionView__Content' id="ViewResident__Content__Container" >
                        <div className="SectionView__Sections">
                            <h5 className='SectionView__Sections__Title'>
                                General Information
                            </h5>
                            <div id='GeneralInformation__Container'>
                                <Avatar sx={{ width: 76, height: 76 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                <div className='GeneralInformation__InfoContainer'>
                                    <h6>Name:</h6>
                                    {/* <h5>{user.name.firstName + " " + user.name.lastName}</h5> */}
                                    <h6>User ID:</h6>
                                    {/* <h5>{user.userId}</h5> */}
                                </div>
                                <div className='GeneralInformation__InfoContainer'>
                                    <h6>Email: </h6>
                                    {/* <h5>{user.email}</h5> */}
                                    <h6>Registered Since: </h6>
                                    {/* <h5>{new Date(user.createdAt).toLocaleString('default', { month: 'long' }) + " " + new Date(user.createdAt).getDate() + ", " + new Date(user.createdAt).getFullYear() }</h5> */}
                                </div>
                                <Button variant="contained" href='/profile/edit'>Edit Profile</Button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>
}

export default GuardProfile