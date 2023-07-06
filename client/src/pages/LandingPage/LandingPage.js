import React from 'react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import './LandingPage.scss';
import Button from '@mui/material/Button';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function LandingPage() {
	const element = document.getElementById('section-1');

	return (
		<>
			<div id="landingPage">
				<Header />
				<div className="SectionHolder">
					<section
						className="Section"
						id="MainSection"
					>
						<div id="MainSection__Container">
							<div id="MainSection__About">
								<h1>HOAST</h1>
								<h4>
									A homeowner association information
									management website that employs QR coding
									that would provide a safe and efficient
									platform for homeowners to manage and access
									vital community information.
								</h4>
							</div>
						</div>
					</section>
				</div>
				<Footer />
			</div>
		</>
	);
}

export default LandingPage;
