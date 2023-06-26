// Export a middleware function that handles errors
module.exports = (err, req, res, next) => {
    // Log the stack trace of the error to the console
    console.error(err.stack);

    // Send a response with status 500 (Internal Server Error) 
    // and a JSON object containing a message and the error
    res.status(500).json({
        // A generic error message for the client
        message: 'An unexpected error occurred.',

        // Include the error message from the caught error. 
        // The toString() method is used to convert the error object to a string.
        error: err.toString()
    });
};
