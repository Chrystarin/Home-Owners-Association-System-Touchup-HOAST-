
window.onload = () => {
	// File reader + HTML elements
	var reader = new FileReader(),
		picker = document.getElementById('picker'),
		table = document.getElementById('table');

	// Read CSV on File Pick
	picker.onchange = () => {
		reader.readAsText(picker.files[0]);
	};

	// Reads the CSV file and Generate HTML
	reader.onload = () => {
		// Entire CSV file
		let csv = reader.result;

		// Clear HTML Table
		table.innerHTML = '';

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

		console.log(data);
	};

	function columner(row) {
		return row.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g);
	}
};

