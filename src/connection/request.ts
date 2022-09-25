import { api } from './secure';
import http from 'https';

export const request = http.request(api, (res) => {
    let response;

    console.log('req', api);

    if (res.statusCode === 401) {
        console.log('Unauthorized');
    } else if (res.statusCode !== 200) {
        console.log(
            `Error Message: ${res.statusMessage}, Code: ${res.statusCode}`,
        );
    } else {
        res.setEncoding('utf8');
        let rawData = '';

        res.on('data', (chunk) => {
            rawData += chunk;
        });

        res.on('end', () => {
            try {
                response = {
                    success: res.statusCode === 200,
                    code: res.statusCode,
                    response: rawData ? JSON.parse(rawData) : null,
                };
                console.log(response);
            } catch (err) {
                console.error(err);
            }
        });
    }
});
