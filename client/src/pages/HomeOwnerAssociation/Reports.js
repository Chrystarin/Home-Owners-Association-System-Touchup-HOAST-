import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NavBar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import './Dashboard.scss';
import SideBar from './SideBar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import WalletIcon from '@mui/icons-material/Wallet';
import axios from '../../utils/axios';
import { TablePagination, TableFooter } from '@mui/material';
import './AssociationDues.scss';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';
import './Reports.scss';
import loading from '../../images/loading.gif';
function Reports() {
    const [homes, setHomes] = useState();
    const [guards, setGuards] = useState();
    const [residents, setResidents] = useState();
    const [logs, setLogs] = useState();
    const [vehicles, setVehicles] = useState();

    const [openSnackBar, setOpenSnackBar] = React.useState({
        open: false,
        type: '',
        note: ''
    });

    // Retrieves Homes
    const fetchHomes = async () => {
        await axios
            .get(`homes`, {
                params: {
                    hoaId: process.env.REACT_APP_HOA_ID
                }
            })
            .then((response) => {
                setHomes(response.data);
            });
    };

    const fetchGuards = async () => {
        await axios
            .get(`hoas/guards`, {
                params: {
                    hoaId: process.env.REACT_APP_HOA_ID
                }
            })
            .then((response) => {
                setGuards(response.data);
            });
    };

    const fetchLogs = async () => {
        await axios
            .get(`logs`, {
                params: {
                    hoaId: process.env.REACT_APP_HOA_ID
                }
            })
            .then((response) => {
                setLogs(response.data);
            });
    };

    const fetchResidents = async () => {
        await axios
            .get(`residents`, {
                params: {
                    hoaId: process.env.REACT_APP_HOA_ID
                }
            })
            .then((response) => {
                setResidents(response.data);
            });
    };

    const fetchVehicles = async () => {
        await axios
            .get(`vehicles`, {
                params: {
                    hoaId: process.env.REACT_APP_HOA_ID
                }
            })
            .then((response) => {
                setVehicles(response.data);
            });
    };

    useEffect(() => {
        fetchHomes();
        fetchGuards();
        fetchLogs();
        fetchResidents();
        fetchVehicles();
    }, []);

    if (!homes || !guards || !residents || !logs || !vehicles)
        return (
            <div className="Loading">
                <img src={loading} alt="loading" />
            </div>
        );

    return (
        <>
            <NavBar />
            <div className="SectionHolder">
                <section className="Section SectionManage">
                    <SideBar active="Reports" />
                    <div id="HOA__Content">
                        <h3 className="SectionTitleDashboard">
                            <span>
                                <a href="">Reports</a>
                            </span>
                        </h3>
                        <div className="ReportCards">
                            <div className="">
                                <p>Homes</p>
                                <p>{homes.length}</p>
                                <a href="/homelist">View</a>
                            </div>
                            <div className="">
                                <p>Logs</p>
                                <p>{logs.length}</p>
                                <a href="/logs">View</a>
                            </div>
                            <div className="">
                                <p>Residents</p>
                                <p>{residents.length}</p>
                                <a href="/residentslist">View</a>
                            </div>
                            <div className="">
                                <p>Guards</p>
                                <p>{guards.length}</p>
                                <a href="/guard">View</a>
                            </div>
                            <div className="">
                                <p>Homeowners</p>
                                <p>{homes.length}</p>
                                <a href="/homelist">View</a>
                            </div>
                            <div className="">
                                <p>Vehicles</p>
                                <p>{vehicles.length}</p>
                                <a href="/vehiclelist">View</a>
                            </div>
                        </div>
                    </div>
                </section>
                <SnackbarComp open={openSnackBar} setter={setOpenSnackBar} />
            </div>
        </>
    );
}

export default Reports;
