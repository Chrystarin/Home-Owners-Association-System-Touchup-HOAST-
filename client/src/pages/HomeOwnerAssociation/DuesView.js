import React, { useState, useEffect } from 'react';
import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card.js';

import axios from '../../utils/axios';

import './DuesView.scss';

// create table for viewing dues
function ViewDues(){
    const [dues, setDues] = useState();

    useEffect(() => {
        const fetchDues = async () => {
            await axios.get(`dues`).then((response) => {
                setDues(response.data);
                console.log(response.data);
            });
        };

        fetchDues();
    }, []);

    if (!dues) return <div>Loading...</div>;

    return (
        <>
            <div id="SectionHolder">
                <section className="Section">
                    <h3 className="SectionTitleDashboard"> Dues</h3>
                    <div className="SectionController">
                        <div id="SearchInput__Container">
                            <SearchInput />
                        </div>
                        <Button
                            variant="text"
                            startIcon={<FilterAltIcon />}
                        >
                            Filter
                        </Button>
                        <Button
                            variant="contained"
                            href="/dues/add"
                        >
                            Add Dues
                        </Button>
                    </div>

                    <div className="SectionList">
                        {dues.length === 0 ? (
                            <p>No dues found!</p>
                        ) : (
                            <>
                                {dues.length > 0 &&
                                    dues.map((dues) => (
                                        <Card
                                            type="Dues"
                                            key={dues.duesId}
                                            duesId={dues.duesId}
                                            amount={dues.amount}
                                            months={dues.months}
                                        />
                                    ))}
                            </>
                        )}
                    </div>                  
                </section>
            </div>
        </>
    )
}

export default ViewDues;