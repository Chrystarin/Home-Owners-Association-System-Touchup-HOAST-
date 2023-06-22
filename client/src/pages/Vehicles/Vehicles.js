import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';


import Button from '@mui/material/Button';
import Navbar from '../../layouts/NavBar';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card.js';
import loading from '../../images/loading.gif';
import Filter from '../../components/Filter/Filter.js';
function Vehicles() {
    
    const [vehicles, setVehicles] = useState();
    const [data,setData] = useState({});
    const [filterValue,setFilterValue] = useState(
        {
            sortBy:"A_Z"
        }
    );

    // Retrieve All User Vehicles Data
    useEffect(() => {
        const fetchVehicles = async () => {
        await axios
            .get(`vehicles`)
            .then((response) => {
                setVehicles(response.data);
            });
        };
        fetchVehicles();
    }, []);

    // Returns loading if data is not yet retrieved
    if(!vehicles) return <>
        <div className='Loading'>
            <img src={loading} alt="" />
            <h3>Loading...</h3>
        </div>
    </>

    return <>
        <Navbar type="vehicles"/>
        <div className='SectionHolder'>
        <section className='Section'>
            <h3 className='SectionTitleDashboard'> Vehicles</h3>
            <div className='SectionController'>
                <div id='SearchInput__Container'>
                    <SearchInput setData={setData} data={vehicles} keys={["plateNumber","brand","model","type"]} filterValue={filterValue}/>
                </div>
                <Filter value={filterValue} setValue={setFilterValue}/>
                <Button variant="contained" href='/vehicles/add'>Add Vehicles</Button>
            </div>

            <div className='SectionList'>
            {(data.length === 0 )?
                <p>No Vehicles found!</p>
                :
                <>
                    {data.length > 0 &&
                    data.map((vehicle) => {
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
        </section>
        </div>
  </>
}

export default Vehicles