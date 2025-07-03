import axios from 'axios';

export function handleStatus(token) {
    const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': '3c80a113c8mshb48590a41fe6e12p14f11fjsn3e5e0f787c85',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };
    return axios.request(options).then(
        (response) => { return response; }
    ).catch(
        (error) => { throw error; }
    )

}