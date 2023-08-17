exports.handle400s = (err, request, response, next) => {
    if (err.code === '23502'){
        response.status(400).send({msg: "Bad request"})
    } else {
        next (err)
    }
}

exports.handleCustomErrors = (err, request, response, next) => {
    if (err.status && err.msg){
        response.status(err.status).send({msg:err.msg})
    } else {
        next(err)
    }
}