
const asynHandler = (requestHandler) => (req, res, next) => {
    return Promise.resolve(requestHandler(req, res, next))
        .catch((error) => {
            next(error);
        })
}

export { asynHandler }

/*
const asynHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    }
    catch (error) {
        res.status(error.code || 500)
            .json({
                success: false,
                message: error.message
            })
    }
}*/
