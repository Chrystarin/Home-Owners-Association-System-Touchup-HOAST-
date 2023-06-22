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
function HomeList() {
	const [homes, setHomes] = useState();
    const [requests, setRequests] = useState();

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

    async function approveRequest( hoaId, reqId){
        try{
            await axios
            .patch(`requests`, 
                JSON.stringify({
                    hoaId: hoaId,
                    requestId: reqId,
                    status: 'approved'
                })
            )
            .then((response) => {
                setRequests(response.data);
                alert("Request Approved!")
                fetchHomes();
                fetchRequests();
            });
        }
        catch(err){
            console.log(err)
        }
    }

    async function declineRequest( hoaId, reqId){
        try{
            await axios
            .patch(`requests`, 
                JSON.stringify({
                    hoaId: hoaId,
                    requestId: reqId,
                    status: 'rejected'
                })
            )
            .then((response) => {
                setRequests(response.data);
                alert("Request Rejected!")
                fetchHomes();
                fetchRequests();
            });
        }
        catch(err){
            console.log(err)
        }
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
					<img
						src={loading}
						alt=""
					/>
					<h3>Loading...</h3>
				</div>
			</>
		);

    if(!homes) return <>
    <div className='Loading'>
      <img src={loading} alt="" />
      <h3>Loading...</h3>
    </div>
  </>

    return <>
        <NavBar/>
        <div className='SectionHolder'>
            <section className='Section SectionManage'>
                <SideBar active="HomesList" access="admin"/>
                <div id='HOA__Content'>
                    {/* <h3 className='SectionTitleDashboard'><span><a href="">Home List</a></span></h3> */}
                    <div className='SectionStepper'> 
                        <Button variant='text' className={stepper== 1? "active":""} onClick={()=>setStepper(1)}>Home List</Button>
                        <Button variant='text' className={stepper== 2? "active":""} onClick={()=>setStepper(2)}>Join Requests</Button>
                        {/* <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>Incoming</Button>
                        <Button variant='text' className={(stepper === 2)?"active":""} onClick={()=> setStepper(2)}>History</Button> */}
                    </div>
                    {stepper==1?<>
                        <div className='SectionController'>
                        <div id='SearchInput__Container'>
                            {/* <SearchInput/> */}
                        </div>
                        <Button variant="" startIcon={<FilterAltIcon/>} onClick={(event) => setAnchorElFilter(event.currentTarget)}>Filter</Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorElFilter}
                            open={openFilter}
                            onClose={() => {
                                setAnchorElFilter(null);
                            }}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <div className='Filter'>
                                <h6 className='Filter__Title'>Filter</h6>
                                <ul>
                                    <li>
                                    <p className="BodyText3 Filter__Titles">Sort by</p>
                                    <div>
                                    <NativeSelect
                                        defaultValue={null}
                                        inputProps={{
                                        name: 'age',
                                        id: 'uncontrolled-native',
                                        }}
                                    >
                                        <option value={10}>A to Z</option>
                                        <option value={20}>Recent Register</option>
                                        <option value={30}>More Residents</option>
                                    </NativeSelect>
                                    </div>
                                    </li>
                                </ul>
                                <div className='Filter__Buttons'>
                                    <div>
                                    <Button variant=''>Reset All</Button>
                                    </div>
                                    <Button variant=''>Cancel</Button>
                                    <Button variant='contained' onClick={() => {setAnchorElFilter(null)}}>Apply</Button>
                                </div>
                            </div>
                        </Menu>
                    </div>
                    <div className='SectionList'>
                        
                        {(homes.length === 0 )?
                            <p>No homes found!</p>
                            :
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
                        }
                    </div>
                    </>:<></>}
                    {stepper==2?<>
                            <div className='SectionController'>
                                <div id='SearchInput__Container'>
                                    {/* <SearchInput/> */}
                                </div>
                                <Button variant="" startIcon={<FilterAltIcon/>} onClick={(event) => setAnchorElFilter(event.currentTarget)}>Filter</Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorElFilter}
                                    open={openFilter}
                                    onClose={() => {
                                        setAnchorElFilter(null);
                                    }}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <div className='Filter'>
                                        <h6 className='Filter__Title'>Filter</h6>
                                        <ul>
                                            <li>
                                            <p className="BodyText3 Filter__Titles">Sort by</p>
                                            <div>
                                            <NativeSelect
                                                defaultValue={null}
                                                inputProps={{
                                                name: 'age',
                                                id: 'uncontrolled-native',
                                                }}
                                            >
                                                <option value={10}>A to Z</option>
                                                <option value={20}>Recent Register</option>
                                                <option value={30}>More Residents</option>
                                            </NativeSelect>
                                            </div>
                                            </li>
                                        </ul>
                                        <div className='Filter__Buttons'>
                                            <div>
                                            <Button variant=''>Reset All</Button>
                                            </div>
                                            <Button variant=''>Cancel</Button>
                                            <Button variant='contained' onClick={() => {setAnchorElFilter(null)}}>Apply</Button>
                                        </div>
                                    </div>
                                </Menu>
                            </div> 
                            <div className='SectionList'>
                                {(requests.length === 0 )?
                                    <p>No Requests found!</p>
                                :
                                    <>
                                        
                                        {requests.length > 0 &&
                                        requests.map((request) => {
                                            if (request.status=='pending'){
                                                return <>
                                                    <div key={request.requestId} className="RequestCard">
                                                        <div className='RequestCard__Header'>
                                                            <h6>Address:</h6>
                                                            <div className='RequestCard__Header__Address__Container'>
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
                                                        <div className='RequestCard__Requestor'>
                                                            <Avatar sx={{ width: 46, height: 46 }}/>
                                                            <div>
                                                                <p className="BodyText2">{request.requestor.name.firstName}{' '}{request.requestor.name.lastName}</p>
                                                                <p className="BodyText3">Home Owner</p>
                                                            </div>
                                                        </div>
                                                        <div className='RequestCard__Buttons'>
                                                            <Button className='SecondaryBtn' variant='contained' onClick={()=>declineRequest(request.hoa.hoaId,request.requestId)}>Decline</Button>
                                                            <Button className='PrimaryBtn' variant='contained' onClick={()=>approveRequest(request.hoa.hoaId,request.requestId)}>Approve</Button>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        })}
                                    </>
                                }
                            </div>
                        </>:<></>}
                </div>
            </section>
        </div>
    </>
}

export default HomeList;
