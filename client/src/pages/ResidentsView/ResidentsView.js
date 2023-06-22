import React,{useState,useEffect} from 'react'
import Navbar from '../../layouts/NavBar';
import './ResidentsView.scss';
import Avatar from '@mui/material/Avatar';
import Card from '../../components/Card/Card.js';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import QRCodeCard from '../../layouts/QRCodeCard';

import axios from '../../utils/axios';
import { useParams } from 'react-router-dom';
import {useAuth} from './../../utils/AuthContext.js';

function ResidentsView() {
    const { id, resId } = useParams();
    const {isRole, isResident, isHomeowner} = useAuth();
    const [resident,setResident]=useState()

    // Runs onLoad
	useEffect(() => {
		const fetchResident = async () => {
			await axios
				.get(`residents`, {
					params: {
						residentId: resId,
                        hoaId: (isRole('admin') || isRole('guard')) ? localStorage.getItem('hoaId') : null,
                        homeId: (isResident(id) || isHomeowner(id)) ? id : null
					}
				})
				.then((response) => {
                    setResident(response.data)
                    console.log(response.data)
				});
		};
		fetchResident();
	}, []);


    function createData(name,calories) {
        return { name, calories};
    }
    const rows = [
        createData('Enter', "Tue, 07 Feb 20 23 02:37:40 GMT"),
        createData('Exit', "Tue, 07 Feb 20 23 02:37:40 GMT" ),
    ];

    // Sample Data
    const CarOwner = {
        title:"#ASC231S",
        subTitle1:"Sportivo",
        subTitle2:"ISUZU"
    }
    const HomeOwner = {
        title:"Castillo's Residence",
        subTitle1:"Saint Dominic",
        subTitle2:"8 Residents"
    }


    if(!resident) return <div>Loading...</div>

    return <>
        <Navbar type="home"/>
        <div className='SectionHolder'>
            <section className='Section'>
            <h3 className='SectionTitleDashboard'><span><a href="/homes">Homes</a></span>  > <span>{resident.user.name.firstName + " " + resident.user.name.lastName}</span></h3>
                <div className='SectionContent SectionView' id='ViewResident'>
                    <div className='SectionView__Content' id="ViewResident__Content__Container" >
                        <div className="SectionView__Sections">
                            <h5 className='SectionView__Sections__Title'>
                                General Information
                            </h5>
                            <div id='GeneralInformation__Container'>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                <div className='GeneralInformation__InfoContainer'>
                                    <h6>Name:</h6>
                                    <h5>{resident.user.name.firstName + " " + resident.user.name.lastName}</h5>
                                </div>
                                <div className='GeneralInformation__InfoContainer'>
                                    <h6>Registered Since: </h6>
                                    <h5>{resident.user.createdAt}</h5>
                                </div>
                            </div>
                        </div>
                        {/* <div className="SectionView__Sections">
                            <h5 className='SectionView__Sections__Title'>
                                Homes
                            </h5>
                            <div className='SectionList' id='Homes__Container'>
                                <Card type="Home" {...HomeOwner}/>
                                <Card type="Home" {...HomeOwner}/>
                            </div>
                        </div> */}
                        <div className="SectionView__Sections">
                            <h5 className='SectionView__Sections__Title'>
                                Vehicles
                            </h5>
                            <div className='SectionList' id='Vehicles__Container'>
                                {(resident.user.vehicles.length === 0 )?
                                        <p>No vehicles</p>
                                        :
                                        <>{resident.user.vehicles.length > 0 && resident.user.vehicles.map((vehicle) => {
                                            return (
                                                <Card 
                                                    type="Vehicles"
                                                    key={vehicle.plateNumber}
                                                    id={vehicle.plateNumber}
                                                    title={vehicle.plateNumber}
                                                    subTitle1={vehicle.brand}
                                                    subTitle2={vehicle.model}
                                                    url={`/vehicles/${vehicle.plateNumber}`}
                                                />
                                            );
                                        })}</>
                                    }
                            </div>
                        </div>
                        {/* <div className="SectionView__Sections">
                            <h5 className='SectionView__Sections__Title'>
                                Logs
                            </h5>
                            <div id='Logs__Container'>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th" align='center'><h6>Access Type</h6></TableCell>
                                                <TableCell align="center"><h6>Timestamp</h6></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                            <TableCell component="th" scope="row" align='center'>
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="center">{row.calories}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div> */}
                    </div>
                    <div className='SectionView__SidePanel' id="ViewResident__QRCode__Container">
                        {/* <QRCodeCard/> */}
                        <QRCodeCard
                            objId={resident.user.userId}
                            logType={'user'}
						/>
                    </div>
                </div>
            </section>
        </div>
    </>
}

export default ResidentsView