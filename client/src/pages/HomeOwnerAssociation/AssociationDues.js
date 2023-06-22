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
import { TablePagination,TableFooter } from '@mui/material';
import './AssociationDues.scss';
import SnackbarComp from '../../components/SnackBar/SnackbarComp';

function AssociationDues() {
	const [homes, setHomes] = useState();

	const [anchorElFilter, setAnchorElFilter] = React.useState(null);
	const openFilter = Boolean(anchorElFilter);

	const [anchorAddDues, setAnchorAddDues] = useState(null);
	const open = Boolean(anchorAddDues);
	const [openSnackBar, setOpenSnackBar] = React.useState({
		open:false,
		type:"",
		note:""
	});
	const user = JSON.parse(localStorage.getItem('user'));
	console.log(localStorage.getItem('hoaId'));

    const [selectedHome, setSelectedHome] = useState(null);
    const [selectedPaidUntil, setSelectedPaidUntil] = useState(null);

	// Collection of form data
	const [form, setForm] = useState({
		hoaId: '',
		homeId: '',
		amount: '',
		months: ''
	});

	useEffect(() => {
		fetchHomes();
	}, []);

	function updateForm(e) {
		return setForm((prev) => {
			const [key, value] = Object.entries(e)[0];
			prev[key] = value;
			return prev;
		});
	}

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

	async function Submit(e) {
		e.preventDefault();

		console.log(new Date(form.months).getMonth());
		try {
			await axios
				.post(
					`dues`,
					JSON.stringify({
						hoaId: localStorage.getItem('hoaId'),
						homeId: form.homeId,
						amount: parseInt(form.amount),
						months: new Date(form.months).getMonth()
					})
				)
				.then((response) => {
					console.log(response?.data);
                    setAnchorAddDues(null)
					setOpenSnackBar(openSnackBar => ({
						...openSnackBar,
						open:true,
						type:'success',
						note:"Payment Updated!",
					}));
                    fetchHomes();
				});
		} catch (err) {
			setOpenSnackBar(openSnackBar => ({
				...openSnackBar,
				open:true,
				type:'error',
				note:'Invalid Input! ' + err.message,
			}));
			console.error(err.message);
		}
	}

	if (!homes) return <div>Loading...</div>;

	return (
		<>
			<NavBar />
			<div className="SectionHolder">
				<section className="Section SectionManage">
					<SideBar active="AssociationDues" />
					<div id="HOA__Content">
						<h3 className="SectionTitleDashboard">
							<span>
								<a href="">Association Dues</a>
							</span>
						</h3>
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
							{/* <Button variant="contained" onClick={(event) => {setAnchorAddDues(event.currentTarget)}}>New Payment</Button> */}
							<Menu
								id="basic-menu"
								anchorEl={anchorAddDues}
								open={open}
								onClose={() => {setAnchorAddDues(null)}}
								MenuListProps={{
								'aria-labelledby': 'basic-button',
								}}
							>
								<form onSubmit={Submit} className="Form AddDues">
									
									{/* <TextField
										id="filled-password-input"
										label="HOmeId"
										type="text"
										autoComplete="current-password"
										variant="filled"
										disabled
                                        defaultValue={selectedHome}
										// onChange={(e) =>
										// 	updateForm({
										// 		homeId: e.target
										// 			.value
										// 	})
										// }
									/> */}
									<TextField
										id="filled-password-input"
										label="amount"
										InputProps={{
											inputProps: { 
												min: 0
											}
										}}
										type="number"
										autoComplete="current-password"
										variant="filled"
                                        
										onChange={(e) =>
											updateForm({
												amount: e.target
													.value
											})
										}
									/>
									<TextField
										id="filled-password-input"
										label="paidUntil"
										type="date"
										autoComplete="current-password"
										// defaultValue={"2023-01-01"}
                                        defaultValue={
                                            ((new Date(selectedPaidUntil)).getFullYear()) + "-" + String((new Date(selectedPaidUntil)).getMonth() + 1).padStart(2, '0') + "-" + String((new Date(selectedPaidUntil)).getDate()).padStart(2, '0')
                                        }
										variant="filled"
										onChange={(e) =>
											{
												updateForm({
													months: e.target.value
												})
												console.log(e.target.value);
											}
										}
									/>
                                    <div className="Form__Button">
										<Button variant="text" onClick={() => {setAnchorAddDues(null)}}>
											Cancel
										</Button>
										<Button
											variant="contained"
											type="submit"
											className="Submit"
										>
											Submit
										</Button>
									</div>
								</form>
							</Menu>
						</div>
						<div id='Manage__Hoa' className='SectionView'>
							<div className='SectionView__Content'>
								<TableContainer component={Paper} >
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell component="th" align="center" >
													<h6>HomeId</h6>
												</TableCell>
												<TableCell component="th" align="center" >
													<h6>Name</h6>
												</TableCell>
                                                <TableCell component="th" align="center" >
													<h6>Homeowner</h6>
												</TableCell>
												<TableCell component="th" align="center" >
													<h6> Paid Until </h6>
												</TableCell>
												<TableCell component="th" align="center" >
													<h6>Status</h6>
												</TableCell>
                                                
											</TableRow>
										</TableHead>
										<TableBody className='ListBody'>
										{homes.length === 0 ? <></> : 
											<>
												{homes.length > 0 && homes.map( ( home ) => {
                                                    return (
                                                        <TableRow
                                                            key={ home.homeId }
                                                            sx={{ '&:last-child td, &:last-child th':
                                                                    { border: 0 }
                                                            }}
                                                        >
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                align="center"
                                                            >
                                                                { home.homeId }
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                { home.name }
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                { home.owner.name.firstName + " " + home.owner.name.lastName }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                align="center"
                                                            >
                                                                { ((new Date(home.paidUntil)).getMonth() + 1) + " / " + (new Date(home.paidUntil)).getFullYear() }
                                                            </TableCell>
															{new Date().getTime() <= new Date( home.paidUntil ).getTime()
                                                                    ? <>
																		<TableCell align="center" className='ListBody__Green'>
																			Paid
																		</TableCell>
																	</>
                                                                    : <>
																		<TableCell align="center" className='ListBody__Red'>
																			Not Paid
																		</TableCell>
																	</>}
                                                            
                                                            <TableCell align="center">
																<IconButton aria-label="delete" size="small" onClick={(event) => {setAnchorAddDues(event.currentTarget);setSelectedHome(home.homeId);setSelectedPaidUntil(home.paidUntil)}}>
																	<WalletIcon fontSize="small" />
																	Payment
																</IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                                )}
											</>
										}
										</TableBody>
										<TableFooter>
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
										</TableFooter>
									</Table>
								</TableContainer>
							</div>
						</div>
					</div>
				</section>
				<SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/>
			</div>
		</>
	);
}

export default AssociationDues;
