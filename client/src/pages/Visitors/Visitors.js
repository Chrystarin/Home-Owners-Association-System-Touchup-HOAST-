import React, {useState, useEffect} from 'react';
import axios from '../../utils/axios';

import Navbar from '../../layouts/NavBar';
import Card from '../../components/Card/Card.js';
import SearchInput from '../../components/SearchInput/SearchInput';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import loading from '../../images/loading.gif';
import Filter from '../../components/Filter/Filter.js';
function Visitors() {

    const [visitors, setVisitors] = useState();
    const [data,setData] = useState({});
    
    const [filterValue,setFilterValue] = useState(
        {
            sortBy:"A_Z"
        }
    );

    // Retrieves All User Visitors Data onLoad
    useEffect(() => {
        const fetchVisitors = async () => {
            await axios
                .get(`visitors`)
                .then((response) => {
                    setVisitors(response.data);
                });
            };
        fetchVisitors();
    }, []);

    // Returns loading if data is not yet retrieved
    if(!visitors) return <>
        <div className='Loading'>
            <img src={loading} alt="" />
            <h3>Loading...</h3>
        </div>
    </>

    return <>
        <Navbar type="visitors"/>
        <div className='SectionHolder'>
            <section className='Section'>
                <h3 className='SectionTitleDashboard'>Visitors</h3>
                <div className='SectionController'>
                <div id='SearchInput__Container'>
                    <SearchInput setData={setData} data={visitors} keys={["name","hoa"]} filterValue={filterValue}/>
                </div>
                <Filter value={filterValue} setValue={setFilterValue}/>

                <Button variant="contained" href='/visitors/add'>Add Visitors</Button>
                </div>

                <div className='SectionList'>
                    {/* Displays All User's Visitors */}
                    {(data.length === 0 )?
                        <p>No Visitors Available!</p>
                        :
                        <>{data.length > 0 && data.map((visitor) => {
                            return (
                                <Card 
                                type="Visitor"
                                key={visitor.visitorId}
                                title={visitor.name}
                                subTitle1={new Date(visitor.arrival).toLocaleDateString()}
                                subTitle2={new Date(visitor.departure).toLocaleDateString()}
                                url={`/visitors/${visitor.visitorId}`}
                                />
                            );
                        })}</>
                    }
                </div>
            </section>
        </div>
  </>
}

export default Visitors