const sanitizeHtml = require("sanitize-html");

const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,24}$/;

const quillAllowlist = {
    allowedTags: ["p", "br", "strong", "em", "u", "s", "ol", "ul", "li", "a", "blockquote"],
    allowedAttributes: {
        a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
};

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

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
        return validationError("Invalid field types", next);
     }
 
             req.body.name = name.trim();
             req.body.email = email.trim().toLowerCase();
        
     if (!req.body.name) {
     return validationError("Name is required", next);
      }

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

    if (typeof email !== "string" || typeof password !== "string") {
        return validationError("Invalid field types", next);
        }

    req.body.email = email.trim().toLowerCase();

    if(!emailRegex.test(req.body.email)){
        return validationError("Invalid email format", next);
    }
    
    return next();
}

function validateNoteBody(req, res, next) {
    const { title, content } = req.body ?? {};

    if (!title || !content) {
        return validationError("Title and content are required!", next);
    }

    if (typeof title !== "string" || typeof content !== "string") {
        return validationError("Invalid field types", next);
    }

    const trimmedTitle = title.trim();
    const sanitizedContent = sanitizeHtml(content, quillAllowlist).trim();

    if (!trimmedTitle || !sanitizedContent) {
        return validationError("Title and content cannot be empty or whitespace", next);
    }

    req.body.title = trimmedTitle;
    req.body.content = sanitizedContent;

    next();
}

function validateNoteId(req, res, next) {
    const { id } = req.params;
    const noteId = Number(id);

    if (!Number.isInteger(noteId) || noteId <= 0) {
        return validationError("Invalid note ID", next);
    }

    req.params.id = noteId;

    next();
}


module.exports = {
    validateRegister,
    validateLogin,
    validateNoteBody,
    validateNoteId,
};