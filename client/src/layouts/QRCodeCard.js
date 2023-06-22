import React from 'react';
import './QRCodeCard.scss';
import QRCodeimg from '../images/Placeholder/QRcode.png';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
// import sjcl from './sjcl';

function QRCodeCard(props) {
	const password = '#WllcDmAgf^SM4qmC%JBG&L95gqU$&MME9X0%XV*g#tKB2psZX';

	console.log(props.objId);

	// download QR Code
	const DownloadQRCode = (divId, filename) => {
		// Get the div element
		const element = document.getElementById(divId);

		html2canvas(element).then(function (canvas) {
			const createImage = canvas.toDataURL('image/png');
			var anchor = document.createElement('a');

			anchor.setAttribute('href', createImage);
			anchor.setAttribute('download', filename);
			anchor.click();
			anchor.remove();
		});
	};

	function createQrData(objId, logType, hoaId) {
		return JSON.stringify({
			objId: objId,
			logType: logType,
			hoaId: hoaId
		});
	}

	function CardInfo(category) {
		switch (category) {
			case 'Vehicle':
				return (
					<div>
						<h3>Vehicle Pass</h3>
						<h4>{props.objId}</h4>
					</div>
				);
			case 'Visitor':
				return (
					<div>
						<h3>Visitor Pass</h3>
						<h4>{props.objId}</h4>
					</div>
				);
			case 'Resident':
				return (
					<div>
						<h3>Resident Pass</h3>
						<h4>{props.objId}</h4>
					</div>
				);
			default:
				return (
					<div>
						<h3>Empty Pass</h3>
					</div>
				);
		}
	}

	return (
		<>
			<div className="SidePanel__Container">
				<div id="QRCodeContainer">
					{/* <img src={QRCodeimg} alt="" /> */}
					{/* <CardInfo category={props.logType}/> */}
					<QRCode
						size={256}
						style={{
							height: 'auto',
							maxWidth: '100%',
							width: '100%'
						}}
						// value={encryptData(createQrData(props.objId, props.logType, props.hoaId), password)}
						// value={sjcl.encrypt(password, createQrData(props.objId, props.logType, props.hoaId))}
						value={createQrData(
							props.objId,
							props.logType,
							props.hoaId
						)}
						viewBox={`0 0 256 256`}
					/>
				</div>
				<div id="DownloadQR">
					<Button
						variant="contained"
						maxWidth
						onClick={() =>
							DownloadQRCode('QRCodeContainer', 'QRCode.png')
						}
						id="DownloadButton"
						aria-label="add to shopping cart"
					>
						Download QR
					</Button>
				</div>
			</div>
		</>
	);
}

export default QRCodeCard;
