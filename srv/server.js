

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



// Start CDS server
module.exports = cds.server;
