import React from 'react';
import './Card.scss';
import CottageIcon from '@mui/icons-material/Cottage';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import KeyIcon from '@mui/icons-material/Key';
import Person2Icon from '@mui/icons-material/Person2';
function Card(props) {
	function CardType() {
		switch (props.type) {
			case 'Home':
				return <CottageIcon id="Icon" />;
				break;
			case 'Vehicles':
				return <DriveEtaIcon id="Icon" />;
				break;
			case 'Visitor':
				return <Person2Icon id="Icon" />;
				break;
			default:
				break;
		}
	}
	return (
		<a href={props.url}>
			<div
				id="Card"
				className={props.color}
			>
				{/* {
                    (props.type ==="Home")?<CottageIcon id="Icon"/>:<DriveEtaIcon id="Icon"/>
                } */}
				<CardType />
				<h6>{props.title}</h6>
				<p>{props.subTitle1}</p>
				<p>{props.subTitle2}</p>
				<div>{props.type === 'Home' ? <KeyIcon /> : ''}</div>
				{props.type == 'Request' ? (
					<button onClick={props.action}>approve</button>
				) : (
					<div></div>
				)}
			</div>
		</a>
	);
}

export default Card;
