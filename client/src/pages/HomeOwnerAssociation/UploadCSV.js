import axios from '../../utils/axios';
import emailjs from '@emailjs/browser';

export default function MassGenerateAccount() {
    const sendUserCredential = async ({ email, password }) => {
        try {
            await axios.post('users/verify', {
                email: email,
                message:
                    'Your Account has been created for the HOAST Website. Below are your account credentials \n Upon login, please change your password. \n' +
                    'Email: ' +
                    email +
                    '\nPassword: ' +
                    password +
                    "\n Note: Don't share this to anyone"
            });

            return 'Email sent successfully to ' + email;
        } catch (error) {
            return error;
        }
    };

    const UploadCSV = (data) => {
        var reader = new FileReader();

        reader.readAsText(data);

        // Reads the CSV file and Generate HTML
        reader.onload = async () => {
            // Entire CSV file
            let csv = reader.result;

            // Split into Rows
            let [head, ...rows] = csv.split('\n');

            head = ['firstName', 'lastName', 'email', 'contactNo', 'name', 'homeNo', 'street', 'phase'];
            const accounts = [];

            console.log(rows);

            // Objects
            rows.forEach((row) => {
                const subData = {};
                columner(row)?.forEach((col, i) => {
                    subData[head[i]] = col.replace('\r', '');
                });
                accounts.push(subData);
            });

            Promise.allSettled(
                accounts.map((account) =>
                    axios.post('users/homeowner', {
                        hoaId: localStorage.getItem('hoaId'),
                        resident: {
                            firstName: account.firstName,
                            lastName: account.lastName,
                            email: account.email,
                            contactNo: account.contactNo
                        },
                        home: {
                            homeNo: account.homeNo,
                            name: account.name,
                            street: account.street,
                            phase: account.phase
                        }
                    })
                )
            )
                .then((responses) => {
                    responses.filter(({ status }) => status === 'rejected').forEach(console.log);

                    return Promise.allSettled(responses.filter(({ status }) => status === 'fulfilled').map(({ value }) => sendUserCredential(value.data.credentials)));
                })
                .then((responses) => {
                    responses.forEach((response) => console.log(response.value || response.reason));
                })
                .catch(console.error);
        };

        function columner(row) {
            return row.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g);
        }
        // };
    };

    return (
        <>
            <h4>Upload CSV</h4>

            <input type="file" accept=".csv" id="picker" onChange={(e) => UploadCSV(e.target.files[0])} />
        </>
    );
}
