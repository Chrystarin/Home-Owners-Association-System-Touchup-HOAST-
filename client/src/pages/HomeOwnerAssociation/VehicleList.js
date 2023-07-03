import React, { useEffect, useState } from 'react';

import NavBar from '../../layouts/NavBar';
import './Dashboard.scss';
import SideBar from './SideBar';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import loading from '../../images/loading.gif';
import ExcelJS from 'exceljs';
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

    function exportVehiclesList(data) {

        console.log(data);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        // Create the CSV content
        // let csvContent = data
        //     .map((d) => {
        //         const crawled = crawler(d);

        //         return [crawled['plateNumber'], crawled['owner'], crawled['brand'], crawled['model'], crawled['type'], crawled['color']].join(',');
        //     })
        //     .join('\n');

        // console.log(csvContent);

        const date = new Date();
        // Define custom header and footer content
        const headerContent = 'Suburbia East HOA \n VEHICLE LIST REPORT';  
        const footerContent = 'Prepared By: Princess Dela Cruz \n Date Prepared: ' + (date.getMonth() + 1) + " / " + date.getDate() + " / " + date.getFullYear();

        // Set custom header and footer
        worksheet.headerFooter.oddHeader = headerContent;
        worksheet.headerFooter.oddFooter = footerContent;

        worksheet.columns = [
            { header: 'Plate Number', key: 'plateNumber' },
            { header: 'Owner ID', key: 'owner' },
            { header: 'Brand', key: 'brand' },
            { header: 'Model', key: 'model' },
            { header: 'Type', key: 'type' },
            { header: 'Color', key: 'color' }   
        ];

        data.forEach((item) => {
            worksheet.addRow(item);
        });

        console.log(worksheet);

        // Save the Excel file
        workbook.xlsx.writeBuffer().then(function (buffer) {
            saveExcelFile(buffer, 'vehicle_list.xlsx');
        }); 

        // const date = new Date();
        // csvContent =
        //     // `Date,${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}\n` +
        //     // `Header,Vehicles List\n` +
        //     // '\n' +
        //     'Plate Number,Owner ID,Brand,Model,Type,Color\n' + csvContent;

        // console.log(csvContent);

        // // Create a download link
        // const downloadLink = document.createElement('a');
        // downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        // downloadLink.download = 'vehicle_list.csv';

        // // Trigger the download
        // downloadLink.click();
    }

    function saveExcelFile(data, filename) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    if (!vehicles)
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
                    <SideBar active="VehiclesList" />
                    <div id="HOA__Content">
                        <h3 className="SectionTitleDashboard">
                            <span>
                                <a href="">Vehicles List</a>
                            </span>
                        </h3>
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
                            <Button variant="contained" onClick={() => exportVehiclesList(vehicles)}>
                                Export Vehicle List to Excel
                            </Button>
                        </div>
                        <div className="SectionList">
                            {vehicles.length === 0 ? (
                                <p>No Vehicles found!</p>
                            ) : (
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
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default VehicleList;
