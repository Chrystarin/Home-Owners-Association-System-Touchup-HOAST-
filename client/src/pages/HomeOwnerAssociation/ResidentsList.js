import React, { useState, useEffect } from 'react';
import NavBar from '../../layouts/NavBar';
import './Dashboard.scss';
import SideBar from './SideBar';
import Button from '@mui/material/Button';
import ResidentCard from '../../components/ResidentCard/ResidentCard';
import ExcelJS from 'exceljs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import axios from '../../utils/axios';
import loading from '../../images/loading.gif';
function ResidentsList() {
	const [requests, setRequests] = useState();
	const [residents, setResidents] = useState();

	useEffect(() => {
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

		const fetchResidents = async () => {
			await axios
				.get(`residents`, {
					params: {
						hoaId: localStorage.getItem('hoaId')
					}
				})
				.then((response) => {
					console.log(response.data);
					setResidents(response.data);
				});
		};

		fetchResidents();
		fetchRequests();
	}, []);

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
					window.location.reload(true);
				});
		} catch (err) {
			console.log(err);
		}
	}

	// States for Tabs
	const [stepper, setStepper] = useState(1);
	// States for popup filter
	const [anchorElFilter, setAnchorElFilter] = React.useState(null);
	const openFilter = Boolean(anchorElFilter);

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

	function exportResidentsList(data) {

		const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        const date = new Date();
        // Define custom header and footer content
        const headerContent = 'Suburbia East HOA \n RESIDENTS LIST REPORT';
        const footerContent = 'Prepared By: Princess Dela Cruz \n Date Prepared: ' + (date.getMonth() + 1) + " / " + date.getDate() + " / " + date.getFullYear();

        worksheet.headerFooter.oddHeader = headerContent;
        worksheet.headerFooter.oddFooter = footerContent;

        worksheet.columns = [
            { header: 'Resident Name', key: 'visitor' },
			{ header: 'Home ID', key: 'home' },
			{ header: 'Title', key: 'title' }
        ];

        data.forEach((item) => {
			const crawled = crawler(item);
            
            const worksheetItem = {
                visitor: `${crawled['user.name.firstName']} ${crawled['user.name.lastName']}`,
				home: crawled['home'],
				title: crawled['title'] || 'Homeowner'
            }

            worksheet.addRow(worksheetItem);
        });

        console.log(worksheet);

		const dateToday = new Date().getMonth() + 1 + '-' + new Date().getDate() + '-' + new Date().getFullYear();
		
        // Save the Excel file
        workbook.xlsx.writeBuffer().then(function (buffer) {
            saveExcelFile(buffer, 'residents_list_' + dateToday + '.xlsx');
        });
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

	if (!requests || !residents)
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

	return (
		<>
			<NavBar />
			<div className="SectionHolder">
				<section className="Section SectionManage">
					<SideBar active="ResidentsList" />
					<div id="HOA__Content">
						<h3 className="SectionTitleDashboard">
							<span>
								<a href="">Residents List</a>
							</span>
						</h3>

						<div className="SectionStepper">
							{/* <Button variant='text' className={stepper== 1? "active":""} onClick={()=>setStepper(1)}>Residents</Button>
                        <Button variant='text' className={stepper== 2? "active":""} onClick={()=>setStepper(2)}>Join Requests</Button> */}

							{/* <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>Incoming</Button>
                        <Button variant='text' className={(stepper === 2)?"active":""} onClick={()=> setStepper(2)}>History</Button> */}
						</div>
						<div className="SectionController">
							<div id="SearchInput__Container">
								{/* <SearchInput/> */}
							</div>
							<Button
								variant="contained"
								href="/addhomeowner"
							>
								Add Homeowner
							</Button>
							<Button
								variant=""
								startIcon={<FilterAltIcon />}
								onClick={(event) =>
									setAnchorElFilter(event.currentTarget)
								}
							>
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
								transformOrigin={{
									horizontal: 'right',
									vertical: 'top'
								}}
								anchorOrigin={{
									horizontal: 'right',
									vertical: 'bottom'
								}}
							>
								<div className="Filter">
									<h6 className="Filter__Title">Filter</h6>
									<ul>
										<li>
											<p className="BodyText3 Filter__Titles">
												Sort by
											</p>
											<div>
												<NativeSelect
													defaultValue={null}
													inputProps={{
														name: 'age',
														id: 'uncontrolled-native'
													}}
												>
													<option value={10}>
														A to Z
													</option>
													<option value={20}>
														Recent Register
													</option>
													<option value={30}>
														More Residents
													</option>
												</NativeSelect>
											</div>
										</li>
									</ul>
									<div className="Filter__Buttons">
										<div>
											<Button variant="">
												Reset All
											</Button>
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
							<Button variant="contained" onClick={() => exportResidentsList(residents)}>
								Export Residents List to Excel
							</Button>
						</div>
						<div className="SectionList">
							{residents.length === 0 ? (
								<p>No residents found!</p>
							) : (
								<>
									{residents.length > 0 &&
										residents.map((resident) => {
											return (
												<ResidentCard
													key={resident._id}
													username={
														resident.user.name
															.firstName +
														' ' +
														resident.user.name
															.lastName
													}
													type={'View'}
													residentId={
														resident.user.userId
													}
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

export default ResidentsList;
