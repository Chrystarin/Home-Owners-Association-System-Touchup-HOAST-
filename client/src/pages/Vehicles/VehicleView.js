import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import loading from '../../images/loading.gif';
import './VehicleView.scss';

import Navbar from '../../layouts/NavBar';
import QRCodeCard from '../../layouts/QRCodeCard';

import axios from '../../utils/axios';
import { useAuth } from './../../utils/AuthContext.js';
import { Button } from '@mui/material';

function VehicleView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [vehicle, setVehicle] = useState();
    const [logs, setLogs] = useState();
    const { isRole } = useAuth();
    const delinquent = localStorage.getItem('delinquentOf');
    console.log(localStorage.getItem('delinquentOf'));
    useEffect(() => {
        // Retrieves Vehicles
        const fetchVehicle = async () => {
            await axios
                .get(`vehicles`, {
                    params: {
                        plateNumber: id,
                        hoaId: isRole('admin') || isRole('guard') ? localStorage.getItem('hoaId') : null
                    }
                })
                .then((response) => {
                    console.log(response.data);
                    setVehicle(response.data);
                })
                .catch((err) => {
                    navigate(`${err}`);
                });
        };

        // Retrieves All of Specific Visitor's Logs Data
        const fetchLogs = async () => {
            await axios
                .get(`logs`, {
                    params: {
                        objId: `${id}`,
                        logType: 'vehicle',
                        hoaId: isRole('admin') || isRole('guard') ? localStorage.getItem('hoaId') : null
                    }
                })
                .then((response) => {
                    setLogs(response.data);
                });
        };

        // Executes Functions of fetch vehicle and fetch logs
        fetchLogs();
        fetchVehicle();
    }, []);

    // Returns loading if data is not yet retrieved
    if (!vehicle || !logs)
        return (
            <>
                <div className="Loading">
                    <img src={loading} alt="" />
                    <h3>Loading...</h3>
                </div>
            </>
        );

    return (
        <>
            <Navbar type="vehicles" />
            <div className="SectionHolder">
                <section className="Section">
                    <h3 className="SectionTitleDashboard">
                        <span>
                            <a href="/vehicles">Vehicles</a>
                        </span>{' '}
                        > <span>{vehicle.plateNumber}</span>
                    </h3>
                    <div className="SectionContent SectionView" id="ViewResident">
                        <div className="SectionView__Content" id="ViewResident__Content__Container">
                            <div className="SectionView__Sections">
                                <h5 className="SectionView__Sections__Title">General Information</h5>
                                <div id="GeneralInformation__Car">
                                    <div className="Input__Wrapper2">
                                        <div className="GeneralInformation__InfoContainer ">
                                            <h6>Owner:</h6>
                                            <h5>{vehicle.owner || JSON.parse(localStorage.getItem('user')).user.userId}</h5>
                                        </div>
                                        <div className="GeneralInformation__InfoContainer">
                                            <h6>Brand: </h6>
                                            <h5>{vehicle.brand}</h5>
                                        </div>
                                    </div>
                                    <div className="Input__Wrapper2">
                                        <div className="GeneralInformation__InfoContainer ">
                                            <h6>Plate Number:</h6>
                                            <h5>{vehicle.plateNumber}</h5>
                                        </div>
                                        <div className="GeneralInformation__InfoContainer">
                                            <h6>Color: </h6>
                                            <h5>{vehicle.color}</h5>
                                        </div>
                                    </div>
                                    <div className="Input__Wrapper2">
                                        <div className="GeneralInformation__InfoContainer ">
                                            <h6>Model:</h6>
                                            <h5>{vehicle.model}</h5>
                                        </div>
                                        <div className="GeneralInformation__InfoContainer">
                                        </div>
                                    </div>
                                    <Button variant="contained" href={`${vehicle.plateNumber}/update`}>
                                        {' '}
                                        Update
                                    </Button>
                                </div>
                                <div id="GeneralInformation__Car">
                                    <div className="Input__Wrapper2">
                                        <div className="GeneralInformation__InfoContainer ">
                                            <h6>Front Image:</h6>
                                            <img src={vehicle.frontImage} style={{ width: '350px' }} />
                                        </div>
                                        <div className="GeneralInformation__InfoContainer">
                                            <h6>Back Image: </h6>
                                            <img src={vehicle.backImage} style={{ width: '350px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="SectionView__Sections">
                                <h5 className="SectionView__Sections__Title">Logs</h5>
                                <div id="Logs__Container">
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell component="th" align="center">
                                                        <h6>Log Id</h6>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <h6>Timestamp</h6>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {logs.length === 0 ? (
                                                    <p>No Logs Recorded</p>
                                                ) : (
                                                    <>
                                                        {logs.length > 0 &&
                                                            logs.map((log) => {
                                                                return (
                                                                    <TableRow
                                                                        key={log.logId}
                                                                        sx={{
                                                                            '&:last-child td, &:last-child th': {
                                                                                border: 0
                                                                            }
                                                                        }}
                                                                    >
                                                                        <TableCell component="th" scope="row" align="center">
                                                                            {log.logId}
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            {new Date(log.createdAt).toLocaleString('default', {
                                                                                month: 'long'
                                                                            }) +
                                                                                ' ' +
                                                                                new Date(log.createdAt).getDate() +
                                                                                ', ' +
                                                                                new Date(log.createdAt).getFullYear() +
                                                                                ' | ' +
                                                                                new Date(log.createdAt).getHours() +
                                                                                ':' +
                                                                                new Date(log.createdAt).getMinutes() +
                                                                                ':' +
                                                                                new Date(log.createdAt).getSeconds()}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                    </>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                        <div className="SectionView__SidePanel" id="ViewResident__QRCode__Container">
                            {delinquent ? (
                                <div>
                                    You have unpaid dues. The QR code pass will be temporarily revoked until you pay your dues.
                                    <br />
                                    <br />
                                    To gain access to the QR Code pass again, follow these steps:
                                    <br />
                                    1. Go to the admin to check your status.
                                    <br />
                                    2. Pay your balanced dues.
                                    <br />
                                    3. The admin will change your status to paid after making a successful transaction.
                                    <br />
                                    4. Your QR code pass will be available again.
                                </div>
                            ) : (
                                <QRCodeCard objId={vehicle.plateNumber} logType={'vehicle'} hoaId={process.env.REACT_APP_HOA_ID} />
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default VehicleView;
