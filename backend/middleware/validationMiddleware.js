const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validationError(message, next) {
    const error = new Error(message);
    error.status = 400;
    return next(error);
}

function validateRegister(req, res, next) {
    const { name, email, password } = req.body ?? {};

    if(!name || !email || !password){
        return validationError("All fields are required!", next);
    }    

    req.body.email = email.trim().toLowerCase();

    if(!emailRegex.test(req.body.email)){
        return validationError("Invalid email format", next);
    }
    
    if(password.length < 6){
        return validationError("Password must be at least 6 characters", next);
    }  
    return next();
}

function validateLogin(req, res, next){
    const { email, password } = req.body ?? {};

    if(!email || !password){
        return validationError("All fields are required!", next);
    }   

    req.body.email = email.trim().toLowerCase();

    if(!emailRegex.test(req.body.email)){
        return validationError("Invalid email format", next);
    }
    
    return next();
}


module.exports= {validateRegister, validateLogin};