import React, { useState } from 'react';
import './ScannerConfirmationModal.scss';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

import axios from '../../utils/axios';

function ScannerConfirmationModal(props) {
	const [viewMore, setViewMore] = useState(false);

	console.log(props.info);
	console.log(props.data);

	async function acceptEntry() {
		try {
			await axios
				.post(
					`logs`,
					JSON.stringify({
						objectId: props.data.objId,
						logType: props.data.logType,
						hoaId: localStorage.getItem('hoaId')
					})
				)
				.then((response) => {
					const openWindow = () => {
						let result = {};
						const url = `${props.ipAdd}/?header=true`;
						const windowName = 'Access';
						const windowSize = 'width=500,height=300';
						result = window.open(url, windowName, windowSize);
						setTimeout(() => {
							result.close();
							result = null;
						}, 1000);
					};
					openWindow();
					props.close();
				});
		} catch (error) {
			console.log(error);
			const openWindow = () => {
				let result = {};
				const url = `${props.ipAdd}/?header=false`;
				const windowName = 'Access';
				const windowSize = 'width=500,height=300';
				result = window.open(url, windowName, windowSize);
				setTimeout(() => {
					result.close();
					result = null;
				}, 1000);
			};
			openWindow();
			props.close();
		}
	}

	async function denyEntry() {
		try {
			const openWindow = () => {
				let result = {};
				const url = `${props.ipAdd}/?header=false`;
				const windowName = 'Access';
				const windowSize = 'width=500,height=300';
				result = window.open(url, windowName, windowSize);
				setTimeout(() => {
					result.close();
					result = null;
				}, 1000);
			};
			openWindow();
			props.close();
		} catch (error) {
			alert(error);
			props.close();
		}
	}

	return (
		<>
			<div id="ConfirmationModal">
				{props.type === 'user' ? (
					<>
						<div
							className="ConfirmationModal__Template"
							id="ConfirmationModal__User"
						>
							<div className="ConfirmationModal__Header">
								<Avatar className="ConfirmationModal__Avatar" />
								<div className="ConfirmationModal__HeaderInfo">
									<h6 className="ConfirmationModal__Title">
										{props.info.user.name.firstName}{' '}
										{props.info.user.name.lastName}
									</h6>
									<p className="ConfirmationModal__SubTitle">
										Resident
									</p>
								</div>
							</div>
							<div className="ConfirmationModal__BodyInfo">
								<ul>
									<li>
										<p className="ConfirmationModal__BodyInfo__Title">
											Address:
										</p>
										<p className="BodyText3 ConfirmationModal__BodyInfo__Value">
											{props.info.home}
										</p>
									</li>
								</ul>
							</div>
							<div className="ConfirmationModal__Footer">
								<Button
									variant="contained"
									onClick={() => {
										props.close();
										acceptEntry();
									}}
								>
									Accept
								</Button>
								<Button
									variant="contained"
									onClick={() => {
										props.close();
										denyEntry();
									}}
								>
									Decline
								</Button>
							</div>
						</div>
					</>
				) : (
					<></>
				)}
				{props.type === 'visitor' ? (
					<>
						<div
							className="ConfirmationModal__Template"
							id="ConfirmationModal__User"
						>
							<div className="ConfirmationModal__Header">
								<div className="ConfirmationModal__HeaderInfo">
									<h6 className="ConfirmationModal__Title">
										{props.info.name}
									</h6>
									<p className="ConfirmationModal__SubTitle">
										Visitor/s
									</p>
								</div>
							</div>
							<div className="ConfirmationModal__BodyInfo">
								<ul>
									<li>
										<p className="ConfirmationModal__BodyInfo__Title">
											Arrival Date - Departure Date:
										</p>
										<p className="BodyText3 ConfirmationModal__BodyInfo__Value">
											<span>{props.info.arrival}</span> -{' '}
											<span>{props.info.departure}</span>
										</p>
									</li>
									<li
										className={
											viewMore
												? 'BodyText3'
												: 'BodyText3 ConfirmationModal__BodyInfo__More '
										}
									>
										<p className="ConfirmationModal__BodyInfo__Title">
											Note:
										</p>
										<p className="ConfirmationModal__BodyInfo__Value">
											{props.info.note}
										</p>
									</li>
									<li
										className={
											viewMore
												? 'BodyText3'
												: 'BodyText3 ConfirmationModal__BodyInfo__More '
										}
									>
										<p className="ConfirmationModal__BodyInfo__Title">
											Purpose:
										</p>
										<p className="ConfirmationModal__BodyInfo__Value">
											{props.info.purpose}
										</p>
									</li>
									<li
										className={
											viewMore
												? 'BodyText3'
												: 'BodyText3 ConfirmationModal__BodyInfo__More '
										}
									>
										<p className="ConfirmationModal__BodyInfo__Title">
											Address to be visited:
										</p>
										<p className="ConfirmationModal__BodyInfo__Value">
											{props.info.home}
										</p>
									</li>
								</ul>
								<Button
									className="ConfirmationModal__BodyInfo__Button"
									variant="text"
									onClick={() => setViewMore(!viewMore)}
								>
									{viewMore ? 'View Less!' : 'View More!'}
								</Button>
							</div>
							<div className="ConfirmationModal__Footer">
								<Button
									variant="contained"
									onClick={() => {
										props.close();
										acceptEntry();
									}}
								>
									Accept
								</Button>
								<Button
									variant="contained"
									onClick={() => {
										props.close();
										denyEntry();
									}}
								>
									Decline
								</Button>
							</div>
						</div>
					</>
				) : (
					<></>
				)}
				{props.type === 'vehicle' ? (
					<>
						<div
							className="ConfirmationModal__Template"
							id="ConfirmationModal__User"
						>
							<div className="ConfirmationModal__Header">
								<div className="ConfirmationModal__HeaderInfo">
									<h6 className="ConfirmationModal__Title">
										300-2432
									</h6>
									<p className="ConfirmationModal__SubTitle">
										Plate Number
									</p>
								</div>
							</div>
							<div className="ConfirmationModal__BodyInfo">
								<ul>
									<li>
										<p className="ConfirmationModal__BodyInfo__Title">
											Owner:
										</p>
										<p className="BodyText3 ConfirmationModal__BodyInfo__Value">
											Dianne Chrystalin Brandez
										</p>
									</li>
									<li
										className={
											viewMore
												? 'BodyText3'
												: 'BodyText3 ConfirmationModal__BodyInfo__More '
										}
									>
										<p className="ConfirmationModal__BodyInfo__Title">
											Address:
										</p>
										<p className="ConfirmationModal__BodyInfo__Value">
											Abuab II
										</p>
									</li>
									<li
										className={
											viewMore
												? 'BodyText3'
												: 'BodyText3 ConfirmationModal__BodyInfo__More '
										}
									>
										<p className="ConfirmationModal__BodyInfo__Title">
											Color:
										</p>
										<p className="ConfirmationModal__BodyInfo__Value">
											Black
										</p>
									</li>
									<li
										className={
											viewMore
												? 'BodyText3'
												: 'BodyText3 ConfirmationModal__BodyInfo__More '
										}
									>
										<p className="ConfirmationModal__BodyInfo__Title">
											Model & Brand
										</p>
										<p className="ConfirmationModal__BodyInfo__Value">
											Raptor, Ford
										</p>
									</li>
								</ul>
								<Button
									className="ConfirmationModal__BodyInfo__Button"
									variant="text"
									onClick={() => setViewMore(!viewMore)}
								>
									{viewMore ? 'View Less!' : 'View More!'}
								</Button>
							</div>
							<div className="ConfirmationModal__Footer">
								<Button
									variant="contained"
									onClick={() => {
										props.close();
										acceptEntry();
									}}
								>
									Accept
								</Button>
								<Button
									variant="contained"
									onClick={() => {
										props.close();
										denyEntry();
									}}
								>
									Decline
								</Button>
							</div>
						</div>
					</>
				) : (
					<></>
				)}
				{props.type === 'notResident' ? (
					<>
						<div
							className="ConfirmationModal__Template"
							id="ConfirmationModal__User"
						>
							<div className="ConfirmationModal__Header Warning">
								<div className="ConfirmationModal__HeaderInfo">
									<h6 className="ConfirmationModal__Title">
										Not part of the Resident
									</h6>
									<p className="ConfirmationModal__SubTitle">
										QR Code Error
									</p>
								</div>
							</div>
							<div className="ConfirmationModal__Footer">
								<Button
									variant="contained"
									onClick={() => props.close()}
								>
									Continue
								</Button>
							</div>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</>
	);
}

export default ScannerConfirmationModal;
