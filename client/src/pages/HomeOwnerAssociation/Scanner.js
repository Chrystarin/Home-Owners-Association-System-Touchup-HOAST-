import React, { useState, useEffect } from 'react';
import NavBar from '../../layouts/NavBar';
import './Scanner.scss';
import SideBar from './SideBar';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Menu from '@mui/material/Menu';
import QrReader from 'react-qr-scanner';
import Fab from '@mui/material/Fab';
import axios from '../../utils/axios';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ScannerConfirmationModal from './ScannerConfirmationModal';
import TextField from '@mui/material/TextField';
// import sjcl from '../../layouts/sjcl';

function Scanner() {
    const [data, setData] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [manualType, setManualType] = useState();
    const [manualId, setManualId] = useState();
    const [decryptedData, setDecryptedData] = useState();
    const [information, setInformation] = useState();
    const [hoa, setHoa] = useState();
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openFullScreen, setOpenFullScreen] = useState(false);

    let log = null;
    let infoScan = null;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // useEffect(() => {
    // 	// real time clock
    // 	function currentTime() {
    // 		let date = new Date();

    // 		let hour = date.getHours();
    // 		let minutes = date.getMinutes();
    // 		let seconds = date.getSeconds();
    // 		let session = 'AM';

    // 		if (hour == 0) {
    // 			hour = 12;
    // 		}
    // 		if (hour > 12) {
    // 			hour = hour - 12;
    // 			session = 'PM';
    // 		}

    // 		hour = hour < 10 ? '0' + hour : hour;
    // 		minutes = minutes < 10 ? '0' + minutes : minutes;
    // 		seconds = seconds < 10 ? '0' + seconds : seconds;

    // 		let time = hour + ':' + minutes + ':' + seconds + ' ' + session;

    // 		document.getElementById('clock').innerText = time;
    // 		let t = setTimeout(function () {
    // 			currentTime();
    // 		}, 1000);
    // 	}

    // 	// real time date
    // 	function currentDate() {
    // 		let today = new Date();

    // 		let month = today.toLocaleString('default', { month: 'long' });
    // 		let day = today.getDate();
    // 		let year = today.getFullYear();

    // 		let dateToday = month + ' ' + day + ', ' + year;

    // 		document.getElementById('date').innerText = dateToday;
    // 		let d = setTimeout(function () {
    // 			currentDate();
    // 		}, 1000);
    // 	}

    // 	currentTime();
    // 	currentDate();
    // }, []);

    const Clock = () => {
        const [time, setTime] = useState(getCurrentTime());

        useEffect(() => {
            const timer = setInterval(() => {
                setTime(getCurrentTime());
            }, 1000);

            return () => clearInterval(timer);
        }, []);

        function getCurrentTime() {
            const date = new Date();
            const hours = padTime(date.getHours());
            const minutes = padTime(date.getMinutes());
            const seconds = padTime(date.getSeconds());

            return `${hours}:${minutes}:${seconds}`;
        }

        function padTime(time) {
            return time.toString().padStart(2, '0');
        }

        return <div>{time}</div>;
    };

    useEffect(() => {
        fetchHoa();
    }, []);

    const fetchVisitor = async (id) => {
        await axios
            .get(`visitors`, {
                params: {
                    visitorId: id,
                    hoaId: localStorage.getItem('hoaId')
                }
            })
            .then((response) => {
                setInformation(response.data);
                infoScan = response.data;
            });
    };

    const fetchVehicle = async (id) => {
        await axios
            .get(`vehicles`, {
                params: {
                    plateNumber: id,
                    hoaId: localStorage.getItem('hoaId')
                }
            })
            .then(async (response) => {
                setInformation(response.data);
                infoScan = response.data;

                let owner = {};

                const fetchOwner = async () => {
                    await axios
                        .get(`residents`, {
                            params: {
                                residentId: response.data.owner,
                                hoaId: localStorage.getItem('hoaId')
                            }
                        })
                        .then((response) => {
                            owner = response.data.user.name.firstName + ' ' + response.data.user.name.lastName;
                        });
                };
                await fetchOwner();
                infoScan.owner = owner;
            });
    };

    const fetchResident = async (id) => {
        await axios
            .get(`residents`, {
                params: {
                    residentId: id,
                    hoaId: localStorage.getItem('hoaId')
                }
            })
            .then((response) => {
                setInformation(response.data);
                infoScan = response.data;
            });
    };

    const fetchHoa = async (id) => {
        await axios
            .get(`hoas`, {
                params: {
                    hoaId: localStorage.getItem('hoaId')
                }
            })
            .then((response) => {
                setHoa(response.data);
                console.log(response.data);
            });
    };

    const openWindow = (data) => {
        let result = {};
        const url = `${hoa.deviceIP}/?header=${data}`;
        const windowName = 'Access';
        const windowSize = 'width=500,height=300';
        result = window.open(url, windowName, windowSize);
        setTimeout(() => {
            result.close();
            result = null;
            setScanned(false);
        }, 5000);
    };

    async function ProcessAccess(objId, logType) {
        try {
            await axios
                .post(
                    `logs`,
                    JSON.stringify({
                        objectId: objId,
                        logType: logType,
                        hoaId: localStorage.getItem('hoaId')
                    })
                )
                .then((response) => {
                    if (hoa.deviceIP) {
                        openWindow('true');
                    } else {
                        setScanned(false);
                        console.log('No device IP');
                    }
                });
        } catch (error) {
            console.log(error);
            openWindow('false');
            setScanned(false);
            alert(error?.response?.data?.message ?? error.toString());
        }
    }

    // Function upon scanning
    async function handleScan(data) {
        try {
            if (data) {
                console.log('qr code detected');
                setScanned(true);
                setDecryptedData(JSON.parse(data.text));
                log = JSON.parse(data.text);

                switch (log.logType) {
                    case 'visitor':
                        await fetchVisitor(log.objId);
                        console.log(infoScan);
                        if (infoScan) {
                            ProcessAccess(JSON.parse(data.text).objId, JSON.parse(data.text).logType);
                        } else {
                            openWindow('false');
                        }
                        break;
                    case 'vehicle':
                        await fetchVehicle(log.objId);
                        console.log(infoScan);
                        if (infoScan) {
                            ProcessAccess(JSON.parse(data.text).objId, JSON.parse(data.text).logType);
                        } else {
                            openWindow('false');
                        }
                        break;
                    case 'user':
                        await fetchResident(log.objId);
                        console.log(infoScan);
                        if (infoScan) {
                            ProcessAccess(JSON.parse(data.text).objId, JSON.parse(data.text).logType);
                        } else {
                            openWindow('false');
                        }
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.log(error);
            openWindow('false');
            setScanned(false);
            alert(error?.response?.data?.message ?? error.toString());
        }
    }

    async function manualEntry() {
        switch (manualType) {
            case 'visitor':
                await fetchVisitor(manualId);
                break;
            case 'vehicle':
                await fetchVehicle(manualId);
                break;
            case 'user':
                await fetchResident(manualId);
                break;
            default:
                break;
        }
        setOpenConfirmation(true);
    }

    let handleError = (err) => {
        alert(err);
    };

    if (!hoa) return <div>Loading...</div>;

    function QRCodeScanner() {
        return <QrReader delay={1000} onError={handleError} onScan={handleScan} style={{ width: '100%' }} facingmode="front" />;
    }

    return (
        <>
            <NavBar />
            <div className="SectionHolder">
                <section className="Section SectionManage">
                    <SideBar active="Scanner" />
                    <div id="HOA__Content">
                        <h3 className="SectionTitleDashboard">
                            <span>
                                <a>Scanner</a>
                            </span>
                        </h3>
                        <div className="SectionList" id="QRScanner">
                            <div id="QRScanner__Holder">
                                <div id={openFullScreen ? 'ScannerModal' : ''}>
                                    <div id="ScannerModal__Container">
                                        {scanned ? '' : <QRCodeScanner />}

                                        <div id="ScannerModal__Buttons">
                                            <Fab
                                                aria-label="add"
                                                onClick={() => {
                                                    setOpenFullScreen(!openFullScreen);
                                                }}
                                            >
                                                {!openFullScreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
                                            </Fab>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="SidePanel">
                                <div className="SidePanel__Container" id="DateTime">
                                    <div>
                                        <h6>Time:</h6>
                                        <h5>
                                            <Clock />
                                        </h5>
                                    </div>
                                    <div>
                                        <h6>Date:</h6>
                                        <h6>{new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getDate() + ', ' + new Date().getFullYear()}</h6>
                                    </div>
                                </div>
                                <Button variant="contained" onClick={handleClick}>
                                    Manual Check
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        horizontal: 'right',
                                        vertical: 'bottom'
                                    }}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button'
                                    }}
                                >
                                    <div id="ManualInput">
                                        <TextField className="input" id="filled-basic" label="Type" variant="filled" onChange={(e) => setManualType(e.target.value)} />
                                        <TextField className="input" id="filled-basic" label="ID" variant="filled" onChange={(e) => setManualId(e.target.value)} />
                                        <Button variant="contained" onClick={() => manualEntry()}>
                                            Search
                                        </Button>
                                    </div>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </section>
                <Modal
                    open={openConfirmation || openFullScreen}
                    onClose={() => {
                        setOpenConfirmation(false);
                        setOpenFullScreen(false);
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div></div>
                </Modal>
                {openConfirmation ? (
                    <>
                        <ScannerConfirmationModal
                            type={manualType ? manualType : decryptedData.logType}
                            info={information}
                            data={decryptedData}
                            ipAdd={hoa.deviceIP}
                            close={() => {
                                setOpenConfirmation(false);
                                setScanned(false);
                            }}
                        />
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}

export default Scanner;
