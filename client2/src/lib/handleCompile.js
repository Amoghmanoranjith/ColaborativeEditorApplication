import axios from 'axios';
import { languageOptions } from '../constants/languageOptions';

export function handleCompile(language, code, stdin) {
    const language_id = languageOptions.find(opt => opt.value === language.value)?.id;
    const options = {
        method: 'POST',
        url: 'http://localhost:8080/compile',
        params:{
            base64_encoded: 'true'
        },
        headers: {
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