# Backend Development
## Setup for different server applications

To use Django server application
```bash
cd django_server
```
To use express server application
```bash
cd express_server
```

## 
- Authentication Endpoint
    - level of security: level 6
    - bcrypt hashed passwords are implemented
    - middlewares are included
    - authentication is developed based on Tokens
    - verification of accessTokens is handled
    - status responses of the routes are included and the json objects are returned
    - user details are identified by accessToken
    - cors ( cross origin resources sharing) implemented
    - helment middleware implemented
    - express-rate-limit api calls restrictions implemented
    - refresh tokens incorporated
      
- Google Maps Api Endpoint
    -   Api implemented successfully
    -   Api key is unauthorized
    -   expection handled explicitly
    -   returned the status of api along with lat and long of the location
 
- Reset password api Endpoint:
    - route : /user/reset-password
    - model : User
    - description: user is authenticated using Token validation and based on the tokens the user's password is updated in User model

- Reset Email Api Endpoint :
    - route : /user/reset-email
    - model : User
    - description: user is authenticated using Token validation and based on the tokens the user's email is updated in User model

- Register Complaint Api Endpoint:
    - route : /user/register-complaint
    - model : Complaints
    - description: user is authenticated using Token validation and based on the tokens the user's complaints are taken as array of objects , as one customer can raise more than one complaints
  
