import React, { useState, useEffect } from 'react';
import NavBar from '../../layouts/NavBar';
import './Dashboard.scss';
import DuesIcon from '../../images/icons/due-date.png';
import Avatar from '@mui/material/Avatar';
import SideBar from './SideBar';
import Card from '../../components/Card/Card';
import HouseIcon from '../../images/icons/villageSide.png';
import loading from '../../images/loading.gif';
import axios from '../../utils/axios';

function HomeOwnerAssociation() {
	const [guard, setGuard] = useState();
	const [hoa, setHoa] = useState();

	// Runs onLoad
	useEffect(() => {
		const fetchHoa = async () => {
			await axios
				.get(`hoas`, {
					params: {
						hoaId: localStorage.getItem('hoaId')
					}
				})
				.then((response) => {
					setHoa(response.data);
					setGuard(response.data.guards);
				});
		};
		fetchHoa();
	}, []);

	if (!hoa || !guard)
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
					<SideBar active="Dashboard" />
					<div id="HOA__Content">
						<h3 className="SectionTitleDashboard">
							<span>
								<a href="">Dashboard</a>
							</span>
						</h3>
						<div
							id="Manage__Hoa"
							className="SectionView"
						>
							<div className="SectionView__Content">
								<div
									className="SectionView__Sections"
									id="AssociatoinDues__Container"
								>
										<div></div>
									</div>
								</div>
								<div className="SectionView__Sections">
									<h5 className="SectionView__Sections__Title">
										Guard/s
									</h5>
									
								</div>
							</div>
							<div
								className="SectionView__SidePanel"
								id="SectionView_Sidebar"
							>
								<div className="SidePanel__Container SidePanelShowInfo">
									<img
										src={HouseIcon}
										alt=""
									/>
									<div>
										<h6>Homeowner Association: </h6>
										<h5>{hoa.name}</h5>
									</div>
									<div>
										<h6>HOA ID: </h6>
										<h5>{localStorage.getItem('hoaId')}</h5>
									</div>
									<div>
										<h6>Address: </h6>
										<h5>
											{hoa.address.street}{' '}
											{hoa.address.barangay}{' '}
											{hoa.address.city}{' '}
											{hoa.address.province}
										</h5>
									</div>
									<div>
										<h6>Registered Since: </h6>
										<h5>
											{new Date(
												hoa.createdAt
											).toLocaleString('default', {
												month: 'long'
											}) +
												' ' +
												new Date(
													hoa.createdAt
												).getDate() +
												', ' +
												new Date(
													hoa.createdAt
												).getFullYear()}
										</h5>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}

export default HomeOwnerAssociation;
