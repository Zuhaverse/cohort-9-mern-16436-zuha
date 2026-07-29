const jwt = require("jsonwebtoken");

    function authMiddleware(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          return res.status(401).json({
              message: "Access denied. No token provided."
          });
      }

        
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
              message: "Invalid token format.",
            });
          }
        
          const token = authHeader.split(" ")[1];
        
          try {
<<<<<<< HEAD
            
=======
            console.log("JWT Secret:", process.env.JWT_SECRET);
    console.log("Token:", token);
>>>>>>> 56ef3ba (feat: add JWT authentication with middleware and tests)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
            req.user = decoded;
        
            next();
          } catch (error) {
            console.log(error);
        
            return res.status(401).json({
                message: "Invalid or expired token.",
            });
        }
      }

    

    module.exports = authMiddleware;