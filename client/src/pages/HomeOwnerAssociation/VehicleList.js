import React, {useEffect, useState} from 'react'

import NavBar from '../../layouts/NavBar';
import './Dashboard.scss';
import SideBar from './SideBar';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import loading from '../../images/loading.gif'

import axios from '../../utils/axios';

function VehicleList() {

    // States for popup filter
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const openFilter = Boolean(anchorElFilter);

    const [vehicles, setVehicles] = useState();

    // Retrieve All User Vehicles Data
    useEffect(() => {
      const fetchVehicles = async () => {
        await axios
            .get(`vehicles`, {
                params: {
                    hoaId: localStorage.getItem('hoaId')
                }
            })
            .then((response) => {
                setVehicles(response.data);
            });
      };
      fetchVehicles();
    }, []);

    if (!vehicles) return <>
    <div className='Loading'>
      <img src={loading} alt="" />
      <h3>Loading...</h3>
    </div>
  </>

    return <>
        <NavBar/>
        <div className='SectionHolder'>
            <section className='Section SectionManage'>
                <SideBar active="VehiclesList"/>
                <div id='HOA__Content'>
                    <h3 className='SectionTitleDashboard'><span><a href="">Vehicles List</a></span></h3>
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
                    {(vehicles.length === 0 )?
                        <p>No Vehicles found!</p>
                        :
                        <>
                            {vehicles.length > 0 &&
                            vehicles.map((vehicle) => {
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
                            })}
                        </>
                    }
                    </div>
                </div>
            </section>
        </div>
    </>
}

export default VehicleList