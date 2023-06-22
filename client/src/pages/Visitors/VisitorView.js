import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import loading from '../../images/loading.gif';
import './VisitorView.scss';

import Navbar from '../../layouts/NavBar';
import QRCodeCard from '../../layouts/QRCodeCard';

import axios from '../../utils/axios';
import { useAuth } from './../../utils/AuthContext.js';

function VisitorView() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [visitor, setVisitor] = useState();
	const [logs, setLogs] = useState();
	const { isRole } = useAuth();

	// Runs onLoad
	useEffect(() => {
		// Retrieves Specific Visitor Data
		const fetchVisitor = async () => {
			await axios
				.get(`visitors`, {
					params: {
						visitorId: id,
						hoaId:
							isRole('admin') || isRole('guard')
								? localStorage.getItem('hoaId')
								: null
					}
				})
				.then((response) => {
					setVisitor(response.data);
					console.log(response.data);
					// // Retrieves All of Specific Visitor's Logs Data
					const fetchLogs = async () => {
						await axios
							.get(`logs`, {
								params: {
									objId: id,
									logType: 'visitor',
									homeId: response.data.home
								}
							})
							.then((response) => {
								setLogs(response.data);
								console.log(response.data);
							});
					};
					fetchLogs();
				})
				.catch((err) => {
					navigate(`${err}`);
				});
		};

		// Executes Functions of fetch visitors and fetch logs
		fetchVisitor();
	}, []);

	// Returns loading if data is not yet retrieved
	if (!visitor || !logs)
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
			<Navbar type="visitors" />
			<div id="SectionHolder">
				<section className="Section">
					<h3 className="SectionTitleDashboard">
						<span>
							<a href="/">Visitor</a>
						</span>{' '}
						> <span>{visitor.name}</span>
					</h3>
					<div
						className="SectionContent SectionView"
						id="ViewResident"
					>
						<div
							className="SectionView__Content"
							id="ViewResident__Content__Container"
						>
							<div className="SectionView__Sections">
								<h5 className="SectionView__Sections__Title">
									General Information
								</h5>
								<div id="GeneralInformation__Car">
									<div className="Input__Wrapper2">
										<div className="GeneralInformation__InfoContainer ">
											<h6>Owner:</h6>
											<h5>{visitor.name}</h5>
										</div>
										<div className="GeneralInformation__InfoContainer">
											<h6>Arrival Date: </h6>
											<h5>
												{new Date(
													visitor.arrival
												).toLocaleString('default', {
													month: 'long'
												}) +
													' ' +
													new Date(
														visitor.arrival
													).getDate() +
													', ' +
													new Date(
														visitor.arrival
													).getFullYear()}
											</h5>
										</div>
									</div>
									<div className="Input__Wrapper2">
										<div className="GeneralInformation__InfoContainer ">
											<h6>Purpose:</h6>
											<h5>{visitor.purpose}</h5>
										</div>
										<div className="GeneralInformation__InfoContainer">
											<h6>Departure Date: </h6>
											<h5>
												{new Date(
													visitor.departure
												).toLocaleString('default', {
													month: 'long'
												}) +
													' ' +
													new Date(
														visitor.departure
													).getDate() +
													', ' +
													new Date(
														visitor.departure
													).getFullYear()}
											</h5>
										</div>
									</div>
									<div className="Input__Wrapper2">
										<div className="GeneralInformation__InfoContainer ">
											<h6>Note:</h6>
											<h5>{visitor.note}</h5>
										</div>
									</div>
								</div>
							</div>

							<div className="SectionView__Sections">
								<h5 className="SectionView__Sections__Title">
									Logs
								</h5>
								<div id="Logs__Container">
									<TableContainer component={Paper}>
										<Table
											sx={{ minWidth: 650 }}
											aria-label="simple table"
										>
											<TableHead>
												<TableRow>
													<TableCell
														component="th"
														align="center"
													>
														<h6>Log Id</h6>
													</TableCell>
													<TableCell align="center">
														<h6>Timestamp</h6>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{logs.length === 0 ? (
													<p>No Logs Recorded</p>
												) : (
													<>
														{logs.length > 0 &&
															logs.map((log) => {
																return (
																	<TableRow
																		key={
																			log.logId
																		}
																		sx={{
																			'&:last-child td, &:last-child th':
																				{
																					border: 0
																				}
																		}}
																	>
																		<TableCell
																			component="th"
																			scope="row"
																			align="center"
																		>
																			{
																				log.logId
																			}
																		</TableCell>
																		<TableCell align="center">
																			{new Date(
																				log.createdAt
																			).toLocaleString(
																				'default',
																				{
																					month: 'long'
																				}
																			) +
																				' ' +
																				new Date(
																					log.createdAt
																				).getDate() +
																				', ' +
																				new Date(
																					log.createdAt
																				).getFullYear() +
																				' | ' +
																				new Date(
																					log.createdAt
																				).getHours() +
																				':' +
																				new Date(
																					log.createdAt
																				).getMinutes() +
																				':' +
																				new Date(
																					log.createdAt
																				).getSeconds() +
																				' ' +
																				(new Date(
																					log.createdAt
																				).getHours() >=
																				12
																					? 'PM'
																					: 'AM')}
																		</TableCell>
																	</TableRow>
																);
															})}
													</>
												)}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							</div>
						</div>

						<div
							className="SectionView__SidePanel"
							id="ViewResident__QRCode__Container"
						>
							<QRCodeCard
								objId={visitor.visitorId}
								logType={'visitor'}
								hoaId={visitor.home.hoa}
							/>
						</div>

						{/* <button onClick={()=>DownloadQRCode("ViewResident__QRCode__Container", "QRCode.html")}>Download</button> */}
					</div>
				</section>
			</div>
		</>
	);
}

export default VisitorView;
