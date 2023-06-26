const https = require('https');
const GOOGLE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

// This function gets the geocode (latitude and longitude) of a location
exports.getGeocode = async (location, apiKey) => {
    const url = `${GOOGLE_API_URL}?address=${encodeURIComponent(location)}&key=${apiKey}`;
    const data = await new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = ''; 
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(JSON.parse(data));
            });
            response.on('error', (error) => {
                reject(error);
            });
        });
    });
    return data;
};
