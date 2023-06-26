const googleMapsService = require('../services/googleMapsService');

// This function handles a request to get location data
exports.getLocationData = async (req, res) => {
    const location = req.body.location;
    const apiKey = process.env.API_KEY;
    if (!location) {
        return res.status(400).json({ message: 'Location is required' });
    }
    try {
        const apiResponse = await googleMapsService.getGeocode(location, apiKey);
        return res.status(200).json({ locData: apiResponse });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
};
