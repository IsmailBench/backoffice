
let regexName = /^[a-z0-9]+$/i
let regexMac = /^[0-9a-fA-F]{16}$/i


module.exports = (req, res, next) => {
    if( req.body.name ==''){
        return next({
            message : "Name should be enter",
            status : 400
        })
    };
    if( !regexName.test(req.body.name)){
        return next({
            message : "Name should be only alphanumeric",
            status : 400
        })
    };
    if( req.body.mac == ""){
        return next ({
            message : "Mac should be enter",
            status : 400
        })
    }
    if (!regexMac.test(req.body.mac)){
        return next({
            message : "Mac should be hexadecimal and have 16 characters ",
            status : 400
        })
    }
    next();
};
