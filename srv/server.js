

const cds = require("@sap/cds");
const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");


cds.on("bootstrap", (app) => {

    app.use(async (req, res, next) => {
        try {

            // await authenticate(req, next);

            if (req.url == '/') {
                next();
            }
            else {
                if (req['headers'].authorization.split(' ')[0] == 'Basic') {
                    let username = Buffer.from(req['headers'].authorization.split(' ')[1], 'base64').toString('utf8').split(':')[0];
                    let pasword = Buffer.from(req['headers'].authorization.split(' ')[1], 'base64').toString('utf8').split(':')[1];
                    let search_user = await cds.run(`select * from DYNAMICAUTH_APPLICATION_USERS where ID ='${username}' and PASSWORD = '${pasword}'`)
                    let user_state = (search_user.length > 0) ? true : false;

                    if (user_state) {
                        next();

                    } else {
                        let obj = {
                            status: 401,
                            Error: "Unauthorized: Access is restricted to Admin users"
                        }

                        res.status(401).send(obj);
                    }
                }
            }
        }
        catch (error) {

            let obj = {
                status: 401,
                Error: "Unauthorized: Access is restricted to Admin users"
            }

            res.status(401).send(obj);
        }
    });
    app.use(cov2ap());
});


async function authenticate(req, next) {


    if ((req.path.includes('user_information'))) {
        const xsuaaService = xsenv.getServices({
            uaa: {
                name: 'capservsoauth' // Replace with the exact name of the desired service instance
            }
        });
        const clientId = xsuaaService.uaa.clientid;
        const clientSecret = xsuaaService.uaa.clientsecret;
        const tokenUrl = xsuaaService.uaa.url + '/oauth/token';

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);

        await axios.post(tokenUrl, params)
            .then(response => {
                const accessToken = response.data.access_token;

                req.headers.authorization = "Bearer " +
                    accessToken;
                next();
            }).catch(error => {
                console.log("Error obtaining access token:", error);
                next();
            });

    }
    else {
        next();
    }


}

// Start CDS server
module.exports = cds.server;
