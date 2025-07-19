import axios from 'axios';

export function handleStatus(token) {
    const options = {
        method: 'POST',
        url: `http://localhost:8080/status`,
        headers: {
            'Content-Type': 'application/json'
        },
        data:{
            token:token
        }
    };
    return axios.request(options).then(
        (response) => { return response; }
    ).catch(
        (error) => { throw error; }
    )

}