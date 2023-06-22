import React,{useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import '../HomeOwnerAssociation/Logs.scss'

import axios from '../../utils/axios';

function ViewLogs(){

    // const id = "123";
    // const { id } = useParams();
    const [logs, setLogs] = useState();
    const [userLogs, setUserLogs] = useState();
    const [vehicleLogs, setVehicleLogs] = useState();
    const [visitorLogs, setVisitorLogs] = useState();

    useEffect(() => {
        const fetchAllLogs = async () => {
            await axios
                .get(`logs`)
                .then((response) => {
                    setLogs(response.data);
                    console.log(response.data);
                });
        };

        const fetchUserLogs = async () => {
            await axios
                .get(`logs`,{
                    params: {
                        logId: logs.id,
                        logType: 'User'
                    }
                })
                .then((response) => {
                    setUserLogs(response.data);
                    console.log(response.data);
                });
        };

        const fetchVehicleLogs = async () => {
            await axios
                .get(`logs`,{
                    params: {
                        logId: logs.id,
                        logType: 'Vehicle'
                    }
                })
                .then((response) => {
                    setVehicleLogs(response.data);
                    console.log(response.data);
                });
        };

        const fetchVisitorLogs = async () => {
            await axios
                .get(`logs`,{
                    params: {
                        logId: logs.id,
                        logType: 'Visitor'
                    }
                })
                .then((response) => {
                    setVisitorLogs(response.data);
                    console.log(response.data);
                });
        }

        fetchAllLogs();
        fetchUserLogs();
        fetchVehicleLogs();
        fetchVisitorLogs();
    }, []);

    // Returns loading if data is not yet retrieved
    if(!logs) return <div>Loading...</div>

    return <>
        <div className="SectionView__Sections">
                            <h5 className='SectionView__Sections__Title'>
                                Logs
                            </h5>
                            <div id='Logs__Container'>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th" align='center'><h6>Log Id</h6></TableCell>
                                                <TableCell align="center"><h6>Timestamp</h6></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(logs.length === 0 )?
                                                <p>No Logs Recorded</p>
                                                :
                                                <>{logs.length > 0 && logs.map((log) => {
                                                    return (
                                                        <TableRow
                                                            key={log.logId}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row" align='center'>
                                                                {log.logId}
                                                            </TableCell>
                                                            <TableCell align="center">{new Date(log.createdAt).toLocaleString()}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                </>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
    </>
}

export default ViewLogs