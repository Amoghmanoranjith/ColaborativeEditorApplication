import axios from 'axios';
import { languageOptions } from '../constants/languageOptions';

export function handleCompile(language, code, stdin) {
    const language_id = languageOptions.find(opt => opt.value === language.value)?.id;
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'true',
            wait: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': '3c80a113c8mshb48590a41fe6e12p14f11fjsn3e5e0f787c85',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            language_id: language_id,
            source_code: btoa(code),
            stdin: btoa(stdin)
        }
    };
    return axios.request(options).then(
        (response) => { return response; }
    ).catch(
        (error) => { throw error; }
    )
}