require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));

// Constants
const GOOGLE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

// Serve the index.html file on the root route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Post route to get latitude and longitude from Google Maps API
app.post("/", async (req, res) => {
    const location = req.body.location;
    const apiKey = process.env.API_KEY;

    // Validate the input
    if (!location) {
        return res.status(400).json({ message: 'Location is required' });
    }

    try {
        // Encode the URL with the location and API key
        const url = `${GOOGLE_API_URL}?address=${encodeURIComponent(location)}&key=${apiKey}`;

        // Make an HTTPS GET request to the Google Maps API
        const apiResponse = await new Promise((resolve, reject) => {
            https.get(url, (response) => {
                let data = '';

                // Concatenate the response data
                response.on('data', (chunk) => {
                    data += chunk;
                });

                // Parse the data and resolve the promise
                response.on('end', () => {
                    resolve(JSON.parse(data));
                });

                // Reject the promise in case of an error
                response.on('error', (error) => {
                    reject(error);
                });
            });
        });

        // Return the API response
        return res.status(200).json({ locData: apiResponse });
    } catch (error) {
        // Log the error and send a 500 response
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

// Port configuration
const PORT = process.env.PORT || 1234;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Successfully connected to the port ${PORT}...`);
});
app.post("/",function(req,res){
    const location=req.body.location;
    const apikey=process.env.GMAPS_API
    const url="https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key="+apikey;
    https.get(url,function(response){
        response.on("data",function(data){
            try{
                const locData=JSON.parse(data);
                return res.status(200).json({locData})
            }
            catch(error){
                return res.status(400).json({message:'An error event occurred'});
            }
            
            
        })
    })

})
app.listen(1234,function(req,res){
    console.log("successfully connected to the port 1234....")
}); 
