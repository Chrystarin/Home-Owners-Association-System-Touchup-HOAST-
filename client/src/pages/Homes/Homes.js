import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import './Homes.scss';

import Navbar from '../../layouts/NavBar';
import Button from '@mui/material/Button';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card.js';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import loading from '../../images/loading.gif';
import { useAuth } from '../../utils/AuthContext.js';
import Filter from '../../components/Filter/Filter.js';

function Homes() {
	const { user, isAdmin } = useAuth();
	const [homes, setHomes] = useState();
	const [data, setData] = useState({});

	// States for popup filter
	const [filterValue, setFilterValue] = useState({
		sortBy: 'A_Z'
	});

	useEffect(() => {
		// Retrieves Homes
		const fetchHomes = async () => {
			await axios.get(`homes`).then((response) => {
				setHomes(response.data);
			});
		};
		fetchHomes();
	}, []);

	// Returns if member is null
	if (!homes)
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
			<Navbar type="home" />
			<div className="SectionHolder">
				<section className="Section">
					<h3 className="SectionTitleDashboard">Homes</h3>
					<div className="SectionController">
						<div id="SearchInput__Container">
							<SearchInput
								setData={setData}
								data={homes}
								keys={['name', 'hoa', 'owner.name']}
								filterValue={filterValue}
							/>
						</div>
						<Filter
							value={filterValue}
							setValue={setFilterValue}
						/>
						<Button
							variant="contained"
							href="/homes/add"
						>
							Add Home
						</Button>
					</div>

					<div className="SectionList">
						{data.length === 0 ? (
							<p>No homes found!</p>
						) : (
							<>
								{data.length > 0 &&
									data.map((home) => {
										return (
											<Card
												type="Home"
												key={home.homeId}
												id={home.homeId}
												title={home.name}
												color={home.color}
												subTitle1={home.address.number}
												subTitle2={home.address.street}
												url={`/homes/${home.homeId}`}
											/>
										);
									})}
							</>
						)}
					</div>
				</section>
			</div>
		</>
	);
}

export default Homes;
