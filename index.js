const bodyParser = require("body-parser");
const express = require("express");
const logging = require('./src/config/logger');
const config = require('./src/config/config');
const healthCheckRoutes = require('./src/routes/healthCheckRoute');

const NAMESPACE = 'Server';
const app = express();

/** Logging the request */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })

    next();
});

/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
app.use('/api', healthCheckRoutes);

/** Error handling route*/
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});


const runServer = () => {
    app.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running at ${config.server.hostname}:${config.server.port}`));
};

runServer();
