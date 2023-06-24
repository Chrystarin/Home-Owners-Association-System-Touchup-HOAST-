import React from 'react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import './LandingPage.scss';


function TermsAndConditions() {
	const element = document.getElementById('section-1');

	return (
		<>
			<div id="landingPage">
				<Header />
				<div className="SectionHolder">
					<section
						className="Section"
						id="Section3"
					>
						<div
							className="SectionTitleLandingPage"
						>
							<h4>Terms and Conditions</h4>
							<p>By accessing or using HOAST, you acknowledge and agree to comply with these terms and conditions. </p>
                            <p>We have created these terms to ensure that our users have a safe, reliable, and enjoyable experience while using our platform. We encourage you to read through them thoroughly to understand your rights and obligations when using HOAST.</p>
                            <h6>Use of HOAST</h6>
                            <p>HOAST is supplied purely for the purpose of administering and coordinating homeowner association management operations. You promise that you will only use HOAST for legal reasons and in line with these terms and conditions. You may not use HOAST in any way that might damage, disable, overburden, or impair the system or interfere with the use and enjoyment of the system by any other person.</p>
                            <h6>Account Registration</h6>
                            <p>Certain HOAST features may necessitate the creation of an account. You promise to provide correct and complete information when creating your account and to keep your login information private. You are responsible for all activities that occur under your account, whether you approve them or not.</p>
                            <h6>Intellectual Property</h6>
                            <p>Text, pictures, software, and code are the property of HOAST or its licensors and are protected by intellectual property laws. Without the prior written approval of HOAST, you may not duplicate, edit, distribute, display, or otherwise use any portion of HOAST.</p>
                            <h6>Limitation of Liability</h6>
                            <p>No matter the legal theory—contract, tort, strict liability, or another—and even if HOAST has been informed of the possibility of such damages, HOAST shall under no circumstances be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of HOAST.</p>
                            
                        </div>
					</section>
				</div>
				<Footer />
			</div>
		</>
	);
}

export default TermsAndConditions;
