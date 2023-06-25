import React,{useState,useEffect} from 'react'
import Navbar from '../../layouts/NavBar';
import './../ResidentsView/ResidentsView.scss';
import Avatar from '@mui/material/Avatar';
import axios from '../../utils/axios';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import {useAuth} from './../../utils/AuthContext.js';
function GuardProfile() {
    const {id} = useParams();
    const [guard, setGuard] = useState();
    const {isRole} = useAuth();

    // Runs onLoad
	useEffect(() => {
        fetchGuards();
	}, []);

    const fetchGuards = async () => {
        await axios
            .get(`hoas/guards`, {
                params: {
                    hoaId: localStorage.getItem('hoaId'),
                    hoaId: (isRole('admin') || isRole('guard')) ? localStorage.getItem('hoaId') : null
                }
            })
            .then((response) => {
                console.log(JSON.stringify(response.data))
                console.log(response.data)
                const getUserById = (userId) => {
                    return (response.data).find(item => item.user.userId === userId);
                };
                setGuard(getUserById(id));
            });
    };

    if (!guard) return <div>Loading...</div>
    
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
                                    <h5>{guard.user.name.firstName + " " + guard.user.name.lastName}</h5>
                                    <h6>User ID:</h6>
                                    <h5>{guard.user.userId}</h5>
                                </div>
                                <div className='GeneralInformation__InfoContainer'>
                                    <h6>Status: </h6>
                                    <h5>{guard.status}</h5>
                                    <h6>Hired Since: </h6>
                                    <h5>{new Date(guard.hiredAt).toLocaleString('default', { month: 'long' }) + " " + new Date(guard.hiredAt).getDate() + ", " + new Date(guard.hiredAt).getFullYear() }</h5>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>
}

export default GuardProfile