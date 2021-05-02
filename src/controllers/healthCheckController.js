exports.serverHealthCheck = (req, res, next) => {
    return res.status(200).json({
        message: 'server healthcheck succeeded'
    });
};
