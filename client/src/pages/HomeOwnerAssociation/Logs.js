import React,{useState, useEffect} from 'react'
import NavBar from '../../layouts/NavBar';
import './Dashboard.scss';
import './Logs.scss'
import SideBar from './SideBar';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import loading from '../../images/loading.gif';
import axios from '../../utils/axios';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Modal from '@mui/material/Modal';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';
import {useAuth} from '../../utils/AuthContext.js';
function Logs() {
    const [home, setHome] = useState();
    const [user, setUser] = useState();
    const [open, setOpen] = React.useState(false);
    const [selectedValue,setSelectedValue] = useState();

    const {isRole} = useAuth();

    const [logs, setLogs] = useState();

    const [data,setData] = useState({});
    const [filterValue,setFilterValue] = useState(
        {
            sortBy:"A_Z"
        }
    );
    const [openSnackBar, setOpenSnackBar] = React.useState({
        open:false,
        type:"",
        note:""
    });
    // States for popup filter
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const openFilter = Boolean(anchorElFilter);

    // Runs onLoad
	useEffect(() => {
		const fetchLogs = async () => {
			await axios
				.get(`logs`, {
					params: {
						hoaId: localStorage.getItem('hoaId')
					}
				})
				.then((response) => {
					setLogs(response.data);
                    console.log(response.data);
                    // console.log(Object.keys(response.data[0]));

                    // // get object headers keys
                    // const headers = Object.keys(response.data[0]).toString();
                    // console.log(headers);
                    
                    // // get object values
                    // const main = response.data.map((data) => {
                    //     return Object.values(data).toString();
                    // });
                    // console.log(main);

                    // // combine headers and values
                    // const csv = [headers, ...main].join('\n');
                    // console.log(csv);

                    // downloadCSV(csv);
				});
		};
		fetchLogs();
	}, []);

    // Retrieves Home Data
    const fetchHome = async (id) => {
        await axios
        .get(`homes`,{
                params: {
                    homeId: id,
                    hoaId: (isRole('admin') || isRole('guard')) ? localStorage.getItem('hoaId') : null
                }
            })
        .then((response) => {
            console.log(response.data);
            setHome(response.data);
        })
    };
    const fetchUser = async (id) => {
        await axios
            .get(`residents`, {
                params: {
                    residentId: id,
                    hoaId: (isRole('admin') || isRole('guard')) ? localStorage.getItem('hoaId') : null,
                }
            })
            .then((response) => {
                setUser(response.data)
                console.log(response.data)
            });
    };

    // Function for downloading csv
    // function downloadCSV(input) {

    //     // create blob
    //     const blob = new Blob([input], { type: 'application/csv' });
        
    //     // create url
    //     const url = URL.createObjectURL(blob);

    //     document.getElementById('downloadButton').addEventListener('click', () => {
    //          // create link
    //         const link = document.createElement('a');
    //         link.download = 'logs.csv';                     // name of the file
    //         link.href = url;                                // url of the file

    //         // append link to the body
    //         document.body.appendChild(link);

    //         // click the link
    //         link.click();

    //         // remove link from the body
    //         link.remove();
    //         URL.revokeObjectURL(url);                       // free up memory
    //     });
    // }

    function tableToCSV() {
 
        // Variable to store the final csv data
        var csv_data = [];

        // Get each row data
        var rows = document.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {

            // Get each column data
            var cols = rows[i].querySelectorAll('td, th');

            // Stores each csv row data
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) {

                // Get the text data of each cell
                // of a row and push it to csvrow
                csvrow.push(cols[j].innerText);
            }

            // Combine each column value with comma
            csv_data.push(csvrow.join(","));
        }

        // Combine each row data with new line character
        csv_data = csv_data.join('\n');

        // Call this function to download csv file 
        downloadCSVFile(csv_data);

    }

    function downloadCSVFile(csv_data) {

        // Create CSV file object and feed
        // our csv_data into it
        const CSVFile = new Blob([csv_data], { type: "application/csv" });

        // Create to temporary link to initiate
        // download process
        var temp_link = document.createElement('a');

        // Download csv file
        temp_link.download = "logs.csv";
        var url = window.URL.createObjectURL(CSVFile);
        temp_link.href = url;

        // This link should not be displayed
        temp_link.style.display = "none";
        document.body.appendChild(temp_link);

        // Automatically click the link to
        // trigger download
        temp_link.click();
        document.body.removeChild(temp_link);
    }

    if(!logs) return <>
    <div className='Loading'>
        <img src={loading} alt="" />
        <h3>Loading...</h3>
    </div>
  </>

    return <>
            
        <NavBar/>
        <div className='SectionHolder'>

            <section className='Section SectionManage'>
                <SideBar active="Logs"/>
                <div id='HOA__Content'>
                    <h3 className='SectionTitleDashboard'><span><a href="">Logs</a></span></h3>
                    <div className='SectionController'>
                        <div id='SearchInput__Container'>
                        <SearchInput setData={setData} data={logs} keys={["logType"]} filterValue={filterValue}/>
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
                                    <Button 
                                        variant='contained' 
                                        onClick={() => {
                                            setAnchorElFilter(null)
                                        }}
                                        >
                                            Apply
                                    </Button>
                                </div>
                            </div>
                        </Menu>
                        <Button variant="contained" id='downloadButton' 
                        onClick={() => {
                            tableToCSV(); 
                            setOpenSnackBar(openSnackBar => ({
                                ...openSnackBar,
                                open:true,
                                type:'info',
                                note:"CSV Downloading",
                            }));
                        }}
                        >Export to Excel</Button>
                    </div>
                    <div id='Manage__Hoa' className='SectionView'>
                        <div className='SectionView__Content'>
                            <TableContainer component={Paper} >
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th" align='center'><h6>Plate/ID Number</h6></TableCell>
                                            <TableCell component="th" align="center"><h6>Name</h6></TableCell>
                                            <TableCell component="th" align='center'><h6>LogType</h6></TableCell>
                                            <TableCell component="th" align="center"><h6>Timestamp</h6></TableCell>
                                            <TableCell component="th" align="center"><h6>Purpose</h6></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {data.length === 0 ? (
													<></>
                                        ) : (
                                            <>
                                                {data.length > 0 &&
                                                    data.map((log) => {
                                                        return <>
                                                            <TableRow
                                                                className='TableRow'
                                                                onClick={()=> {
                                                                    setOpen(true); 
                                                                    setSelectedValue(log);
                                                                    if(log.logType === 'visitor') fetchHome(log["visitor.home"])
                                                                    if(log.logType === 'vehicle') fetchUser(log["vehicle.owner"])
                                                                }}
                                                                key={log.logId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row" align='center'>
                                                                    {log.logType === 'user' ? log["user.userId"] :
                                                                    log.logType === 'vehicle' ? log["vehicle.plateNumber"] :
                                                                    log["visitor.visitorId"]}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {log.logType === 'user' ? log["user.name.firstName"] + ' ' + log["user.name.lastName"] :
                                                                    log.logType === 'vehicle' ? log["vehicle.brand"]:
                                                                    log["visitor.name"]}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" align='center'>{log.logType} </TableCell>
                                                                <TableCell align="center">{new Date(log.createdAt).getMonth() + " - " + new Date(log.createdAt).getDate()  + " - " + new Date(log.createdAt).getFullYear() + " | " + new Date(log.createdAt).getHours() + ":" + new Date(log.createdAt).getMinutes() + ":" + new Date(log.createdAt).getSeconds()}</TableCell>
                                                                <TableCell align="center">{log?.visitor?.purpose}</TableCell>
                                                            </TableRow>
                                                        </>
                                                    })}
                                            </>
                                        )}
                                       
                                        {/* {Logs.map((Log) => (
                                            <TableRow
                                                key={Log.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align='center'>{Log.id} </TableCell>
                                                <TableCell align="center">{Log.Resident}</TableCell>
                                                <TableCell component="th" scope="row" align='center'>{Log.id} </TableCell>
                                                <TableCell align="center">{Log.Timestamp}</TableCell>
                                            </TableRow>
                                        ))} */}
                                    </TableBody>
                                    {/* <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                            colSpan={3}
                                            // count={rows.length}
                                            // rowsPerPage={rowsPerPage}
                                            // page={page}
                                            SelectProps={{
                                                inputProps: {
                                                'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            }}
                                            // onPageChange={handleChangePage}
                                            // onRowsPerPageChange={handleChangeRowsPerPage}
                                            // ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter> */}
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </section>
            <Modal
                open={open}
                onClose={()=> setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='LogsModal'>
                    <div className='LogsModal__Header'>
                        {selectedValue?.logType === "user"? <>
                            <h5>{selectedValue["user.name.firstName"]} {selectedValue["user.name.lastName"]} </h5>
                        </>:""}
                        {selectedValue?.logType === "visitor"? <>
                            <h5>{selectedValue["visitor.name"]}</h5>
                        </>:""}
                        {selectedValue?.logType === "vehicle"? <>
                            <h5>{selectedValue["vehicle.plateNumber"]}</h5>
                        </>:""}
                        <p>{selectedValue?.logType}</p>
                    </div>
                    <ul className='LogsModal__Body'>
                        {selectedValue?.logType === "user"?<>
                            
                            <li>
                                <h6>Log Time</h6>
                                 
                                <p>{new Date(selectedValue.createdAt).getMonth() + " / " + new Date(selectedValue.createdAt).getDate()  + " / " + new Date(selectedValue.createdAt).getFullYear() + " | " + new Date(selectedValue.createdAt).getHours() + ":" + new Date(selectedValue.createdAt).getMinutes() + ":" + new Date(selectedValue.createdAt).getSeconds()}</p>
                            </li>
                        </>:""}
                        {selectedValue?.logType === "visitor"?<>
                            <li>
                                <h6>Arrival - Departure Date: </h6>
                                
                                <p>{new Date(selectedValue["visitor.arrival"] ).getMonth() + " / " + new Date(selectedValue["visitor.arrival"] ).getDate()  + " / " + new Date(selectedValue["visitor.arrival"] ).getFullYear() + " | " + new Date(selectedValue["visitor.arrival"] ).getHours() + ":" + new Date(selectedValue["visitor.arrival"] ).getMinutes() + ":" + new Date(selectedValue["visitor.arrival"] ).getSeconds()} 
                                to {new Date(selectedValue["visitor.departure"]).getMonth() + " / " + new Date(selectedValue["visitor.departure"]).getDate()  + " / " + new Date(selectedValue["visitor.departure"]).getFullYear() + " | " + new Date(selectedValue["visitor.departure"]).getHours() + ":" + new Date(selectedValue["visitor.departure"]).getMinutes() + ":" + new Date(selectedValue["visitor.departure"]).getSeconds()} </p>
                            </li>
                            <li>
                                <h6>Purpose: </h6>
                                <p>{selectedValue["visitor.purpose"]}</p>
                            </li>
                            <li>
                                <h6>Note: </h6>
                                <p>{selectedValue["visitor.note"]}</p>
                            </li>
                            <li>
                                <h6>Home Address: </h6>
                                <p>{home?.hoa.address.street}</p>
                            </li>
                        </>:""}
                        {selectedValue?.logType === "vehicle"?<>
                            <li>
                                <h6>Owner Name</h6>
                                <p>{user?.user.name.firstName} {user.user.name.lastName}</p>
                            </li>
                            <li>
                                <h6>Model</h6>
                                <p>{selectedValue["vehicle.model"]}</p>
                            </li>
                            <li>
                                <h6>Brand</h6>
                                <p>{selectedValue["vehicle.brand"]}</p>
                            </li>
                            <li>
                                <h6>Type</h6>
                                <p>{selectedValue["vehicle.type"]}</p>
                            </li>
                            
                        </>:""}
                    </ul>
                    <div className='LogsModal__Button'>
                        <Button onClick={()=> setOpen(false)} variant='contained' fullWidth>Close</Button>
                    </div>
                </div>
            </Modal>
            <SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/>
        </div>
    </>
}

export default Logs