require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

const createToken = (user) => {
    const accessToken = sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // token will expire in 1 hour
    );
    const refreshToken = sign(
        { username: user.username, id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // refresh token will expire in 7 days
    );
    return accessToken,refreshToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];
    const refreshToken=req.cookies['refresh-token'];
    //checking if there is no refresh token and access Token
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const verifiedToken = verify(accessToken, process.env.JWT_SECRET);

        if (verifiedToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            try{
                const decodedRefreshToken=verify(refreshToken,process.env.JWT_REFRESH_SECRET);
                //Generate a new access token
                const newAccessToken=sign(
                    {username:decodedRefreshToken.username,id:decodedRefreshToken.id},
                    process.env.JWT_SECRET,
                    {expiresIn:'1h'}
                );
                res.cookie('access-token',newAccessToken,{
                    httpOnly:true,
                    secure:true,
                    // SameSite:Strict
                });
                req.authenticated = true;
                return next();
            }
            catch(refreshErr){
                return res.status(401).json({ error: 'Refresh Token Expired' });
            }
            
        } else {
            return res.status(401).json({ error: 'User not authenticated' });
        }
    }
};

module.exports = { createToken, validateToken };
