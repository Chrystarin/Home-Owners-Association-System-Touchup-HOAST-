import React, { useEffect, useState } from 'react';
import NavBar from '../../layouts/NavBar';
import './HomeList.scss';
import SideBar from './SideBar';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import axios from '../../utils/axios';
import loading from '../../images/loading.gif';
import { Avatar } from '@mui/material';
import { useAuth } from '../../utils/AuthContext.js';

function HomeList() {
    const [homes, setHomes] = useState();
    const [requests, setRequests] = useState();
    const { isRole } = useAuth();

    useEffect(() => {
        fetchHomes();
        fetchRequests();
    }, []);

    // Retrieves Homes
    const fetchHomes = async () => {
        await axios
            .get(`homes`, {
                params: {
                    hoaId: localStorage.getItem('hoaId')
                }
            })
            .then((response) => {
                setHomes(response.data);
                console.log(response.data);
            });
    };
    // Retrieves Requests
    const fetchRequests = async () => {
        await axios
            .get(`requests`, {
                params: {
                    hoaId: localStorage.getItem('hoaId')
                }
            })
            .then((response) => {
                setRequests(response.data);
            });
    };

    async function approveRequest(hoaId, reqId) {
        try {
            await axios
                .patch(
                    `requests`,
                    JSON.stringify({
                        hoaId: hoaId,
                        requestId: reqId,
                        status: 'approved'
                    })
                )
                .then((response) => {
                    setRequests(response.data);
                    alert('Request Approved!');
                    fetchHomes();
                    fetchRequests();
                });
        } catch (err) {
            console.log(err);
        }
    }

    async function declineRequest(hoaId, reqId) {
        try {
            await axios
                .patch(
                    `requests`,
                    JSON.stringify({
                        hoaId: hoaId,
                        requestId: reqId,
                        status: 'rejected'
                    })
                )
                .then((response) => {
                    setRequests(response.data);
                    alert('Request Rejected!');
                    fetchHomes();
                    fetchRequests();
                });
        } catch (err) {
            console.log(err);
        }
    }

    function crawler(data, parent = '') {
        return Object.entries(data).reduce((result, [key, value]) => {
            const updatedKey = parent ? `${parent}.${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return {
                    ...result,
                    ...crawler(value, updatedKey)
                };
            }

            return {
                ...result,
                [updatedKey]: value
            };
        }, {});
    }

    function exportHomesList(data) {
        // Create the CSV content
        let csvContent = data
            .map((d) => {
                const crawled = crawler(d);
                const date = new Date(crawled['paidUntil']);

                return [
                    crawled['address.number'],
                    crawled['address.street'],
                    crawled['address.phase'],
                    `${crawled['owner.name.firstName']} ${crawled['owner.name.lastName']}`,
                    crawled['contactNo'],
                    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
                ].join(',');
            })
            .join('\n');
        
        const date = new Date();
        csvContent = `Date,${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}\n` +
                     `Header,Homes List\n` +
                     '\n' +
                     'House No.,Street,Phase,Owner,Contact No,Paid Until\n' +
                     csvContent;

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        downloadLink.download = 'homes_list.csv';

        // Trigger the download
        downloadLink.click();
    }

    function exportHomeownersList(data) {
        // Create the CSV content
        let csvContent = data
            .map((d) => {
                const crawled = crawler(d);
                const date = new Date(crawled['paidUntil']);

                return [
                    `${crawled['owner.name.firstName']} ${crawled['owner.name.lastName']}`,
                    crawled['address.number'],
                    crawled['address.street'],
                    crawled['address.phase'],
                    crawled['owner.email'],
                    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
                ].join(',');
            })
            .join('\n');
        
        const date = new Date();
        csvContent = `Date,${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}\n` +
                     `Header,Homeowners List\n` +
                     '\n' +
                     'Homeowner,House No.,Street,Phase,Email,Paid Until\n' +
                     csvContent;

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        downloadLink.download = 'homeowner_list.csv';

        // Trigger the download
        downloadLink.click();
    }

    const Houses = [
        { name: 'Llagas', address: 'Ucaliptus', residents: '8' },
        { name: 'Castillo', address: 'Saint Dominic', residents: '8' },
        { name: 'Brandez', address: 'Abuab', residents: '8' }
    ];

    // States for Tabs
    const [stepper, setStepper] = useState(1);
    // States for popup filter
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const openFilter = Boolean(anchorElFilter);

    if (!homes)
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
            <NavBar />
            <div className="SectionHolder">
                <section className="Section SectionManage">
                    <SideBar active="HomesList" access="admin" />
                    <div id="HOA__Content">
                        {/* <h3 className='SectionTitleDashboard'><span><a href="">Home List</a></span></h3> */}
                        <div className="SectionStepper">
                            <Button variant="text" className={stepper == 1 ? 'active' : ''} onClick={() => setStepper(1)}>
                                Home List
                            </Button>
                            {isRole('admin') ? (
                                <Button variant="text" className={stepper == 2 ? 'active' : ''} onClick={() => setStepper(2)}>
                                    Join Requests
                                </Button>
                            ) : (
                                <></>
                            )}

                            {/* <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>Incoming</Button>
                        <Button variant='text' className={(stepper === 2)?"active":""} onClick={()=> setStepper(2)}>History</Button> */}
                        </div>
                        {stepper == 1 ? (
                            <>
                                <div className="SectionController">
                                    <div id="SearchInput__Container">{/* <SearchInput/> */}</div>
                                    <Button variant="" startIcon={<FilterAltIcon />} onClick={(event) => setAnchorElFilter(event.currentTarget)}>
                                        Filter
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorElFilter}
                                        open={openFilter}
                                        onClose={() => {
                                            setAnchorElFilter(null);
                                        }}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button'
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <div className="Filter">
                                            <h6 className="Filter__Title">Filter</h6>
                                            <ul>
                                                <li>
                                                    <p className="BodyText3 Filter__Titles">Sort by</p>
                                                    <div>
                                                        <NativeSelect
                                                            defaultValue={null}
                                                            inputProps={{
                                                                name: 'age',
                                                                id: 'uncontrolled-native'
                                                            }}
                                                        >
                                                            <option value={10}>A to Z</option>
                                                            <option value={20}>Recent Register</option>
                                                            <option value={30}>More Residents</option>
                                                        </NativeSelect>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="Filter__Buttons">
                                                <div>
                                                    <Button variant="">Reset All</Button>
                                                </div>
                                                <Button variant="">Cancel</Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        setAnchorElFilter(null);
                                                    }}
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </Menu>
                                    <Button variant="contained" onClick={() => exportHomesList(homes)}>
                                        Export Homes List to Excel
                                    </Button>
                                    <Button variant="contained" onClick={() => exportHomeownersList(homes)}>
                                        Export Homeowners List to Excel
                                    </Button>
                                </div>
                                <div className="SectionList">
                                    {homes.length === 0 ? (
                                        <p>No homes found!</p>
                                    ) : (
                                        <>
                                            {homes.length > 0 &&
                                                homes.map((home) => {
                                                    return (
                                                        <Card
                                                            type="Home"
                                                            key={home.homeId}
                                                            id={home.homeId}
                                                            title={home.name}
                                                            subTitle1={home.address.number}
                                                            subTitle2={home.address.street}
                                                            url={`/homes/${home.homeId}`}
                                                        />
                                                    );
                                                })}
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                        {stepper == 2 ? (
                            <>
                                <div className="SectionController">
                                    <div id="SearchInput__Container">{/* <SearchInput/> */}</div>
                                    <Button variant="" startIcon={<FilterAltIcon />} onClick={(event) => setAnchorElFilter(event.currentTarget)}>
                                        Filter
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorElFilter}
                                        open={openFilter}
                                        onClose={() => {
                                            setAnchorElFilter(null);
                                        }}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button'
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <div className="Filter">
                                            <h6 className="Filter__Title">Filter</h6>
                                            <ul>
                                                <li>
                                                    <p className="BodyText3 Filter__Titles">Sort by</p>
                                                    <div>
                                                        <NativeSelect
                                                            defaultValue={null}
                                                            inputProps={{
                                                                name: 'age',
                                                                id: 'uncontrolled-native'
                                                            }}
                                                        >
                                                            <option value={10}>A to Z</option>
                                                            <option value={20}>Recent Register</option>
                                                            <option value={30}>More Residents</option>
                                                        </NativeSelect>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="Filter__Buttons">
                                                <div>
                                                    <Button variant="">Reset All</Button>
                                                </div>
                                                <Button variant="">Cancel</Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        setAnchorElFilter(null);
                                                    }}
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </Menu>
                                </div>
                                <div className="SectionList">
                                    {requests.length === 0 ? (
                                        <p>No Requests found!</p>
                                    ) : (
                                        <>
                                            {requests.length > 0 &&
                                                requests.map((request) => {
                                                    if (request.status == 'pending') {
                                                        return (
                                                            <>
                                                                <div key={request.requestId} className="RequestCard">
                                                                    <div className="RequestCard__Header">
                                                                        <h6>Address:</h6>
                                                                        <div className="RequestCard__Header__Address__Container">
                                                                            <div>
                                                                                <p className="BodyText3">#</p>
                                                                                <p>{request.details.number}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="BodyText3">Street</p>
                                                                                <p>{request.details.street}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="BodyText3">Phase</p>
                                                                                <p>{request.details.phase}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="RequestCard__Requestor">
                                                                        <Avatar sx={{ width: 46, height: 46 }} />
                                                                        <div>
                                                                            <p className="BodyText2">
                                                                                {request.requestor.name.firstName} {request.requestor.name.lastName}
                                                                            </p>
                                                                            <p className="BodyText3">Home Owner</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="RequestCard__Buttons">
                                                                        <Button
                                                                            className="SecondaryBtn"
                                                                            variant="contained"
                                                                            onClick={() => declineRequest(request.hoa.hoaId, request.requestId)}
                                                                        >
                                                                            Decline
                                                                        </Button>
                                                                        <Button
                                                                            className="PrimaryBtn"
                                                                            variant="contained"
                                                                            onClick={() => approveRequest(request.hoa.hoaId, request.requestId)}
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                })}
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

export default HomeList;
