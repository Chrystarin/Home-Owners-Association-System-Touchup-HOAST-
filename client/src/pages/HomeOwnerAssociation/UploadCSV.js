import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from '../../utils/axios';
export default function MassGenerateAccount() {
	const userCredentials = {
		firstName: '',
		lastName: '',
		email: '',
		password: ''
	};

	const homeCredentials = {
		name: '',
		street: '',
		phase: '',
		contact: '',
		color: ''
	};

	useEffect(() => {});

	const UploadCSV = (data) => {
		console.log(data);
		
		var reader = new FileReader()

		reader.readAsText(data);
		// console.log(reader.readAsText(data));

		// Reads the CSV file and Generate HTML
		reader.onload = async () => {
			// Entire CSV file
			let csv = reader.result;

			// Split into Rows
			let [head, ...rows] = csv.split('\n');
			head = columner(head);

			const data = [];

			// Objects
			rows.forEach((row) => {
				const subData = {};
				columner(row).forEach((col, i) => {
					subData[head[i]] = col;
				});
				data.push(subData);
			});

			// await Promise.allSettled([
			// 	data.map(
			// 		axios.post('/users/signup', {
			// 			firstName: userCredentials.firstName,
			// 			lastName: userCredentials.lastName,
			// 			email: userCredentials.email
			// 		})
			// 	)
			// ]);

			// await Promise.allSettled([
			// 	data.map(
			// 		axios.post('/hoa/join', {
			// 			name: homeCredentials.name,
			// 			street: homeCredentials.street,
			// 			phase: homeCredentials.phase,
			// 			contact: homeCredentials.contact,
			// 			color: 'black'
			// 		})
			// 	)
			// ]);

			console.log(data);
		};

		function columner(row) {
			return row.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g);
		}
		// };
	};

	return (
		<>
			<h4>Upload CSV</h4>

			<input
				type="file"
				accept=".csv"
				id="picker"
				onChange={(e) => UploadCSV(e.target.files[0])}
			/>
		</>
	);
}
