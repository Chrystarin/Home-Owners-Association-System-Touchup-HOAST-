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
								{/* <Button variant="contained">Learn more</Button> */}
							</div>
						</div>
					</section>
					<section
						className="Section"
						id="Section1"
					>
						<div
							className="SectionTitleLandingPage"
							style={{ color: 'white' }}
						>
							<h4>About</h4>
							<h6>
								Advantage of using HOAST to your subdivisions.
							</h6>
						</div>
						<div id="Section1__Cards">
							<div>
								<HomeWorkIcon className="Section1__Icon" />
								<h4>Monitoring Dues is easier</h4>
								<p>
									With financial reports and records from
									HOAST, you can check on payment statuses at
									a glance.
								</p>
							</div>
							<div>
								<HomeWorkIcon className="Section1__Icon" />
								<h4>Online Member Database</h4>
								<p>
									HOAST keep track of members information. As
									a result, a database including names,
									contact information and other crucial are
									maintained. HOAST also allow residents to
									access the system through a portal and
									update their information.{' '}
								</p>
							</div>
							<div>
								<HomeWorkIcon className="Section1__Icon" />
								<h4>More Security</h4>
								<p>
									HOAST offers a logging system for the
									registered vehicle of Homeowners, with the
									help of QR Code Generation and scanning.{' '}
								</p>
							</div>
						</div>
					</section>
					<section
						className="Section"
						id="Section2"
					>
						<div className="SectionTitleLandingPage">
							<h4>Frequently Ask Questions</h4>
						</div>
						<div id="AccordionFAQ">
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography>What is HOAST</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										HOAST is a software-based system that is
										designed to collect, store, manage, and
										disseminate information related to the
										operations of an HOA.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography>How do I use HOAST</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Simply create an account our website
										then create an HOA group if you are a
										member of the HOA board member or send a
										request to join an HOA group if you are
										a homeowner. Once your request have been
										approved by a HOA board member, your
										account will be accepted as one of their
										homeowners and now have access to the
										rest of the functions.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography>
										How to Request to join an HOA Group?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Once created a request to join a HOA
										Group, the HOA member will cross examine
										your account info and your real life
										info, to confirm that you are a real
										member of their HOA. Once confirmed, a
										group admin will accept your request and
										add you to the group.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography>
										How do you Register a vehicle to the
										system?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Hoast provide a way for users to
										register their own car. Simply go to the
										dashboard and click Add Vehicle(s) and
										it will bring you to the Vehicle
										Registration System. Once Registered the
										system will create a QR pass for the
										Vehicle.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography>
										Is the QR pass Secure?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										The QR codes are created in an encrypted
										format. The QR code pass system permits
										admission by validating the person and
										environment that generated the QR code.
									</Typography>
								</AccordionDetails>
							</Accordion>
						</div>
					</section>
				</div>
				<Footer />
			</div>
		</>
	);
}

export default LandingPage;
