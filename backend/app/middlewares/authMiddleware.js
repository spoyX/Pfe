const jwt=require("jsonwebtoken")
const User=require('../User/models/user.js')
exports.authMiddleware = async (req, res, next) => {
    try {
      
  
      // Check if the Authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      // Extract the token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the token
      const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
  
     
       // Check if user exists and account is not expired
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if user account is expired
    if (user.status === 'expired') {
      return res.status(403).json({ message: "Account expired", accountStatus: "expired" });
    }

    // Attach user information to the request object
    req.user = {
      ...decodedToken,
      status: user.status // Include current status in request object
    };
  
      next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        
        // Provide more specific error messages based on the error type
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Token expired" });
        } else if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: "Invalid token" });
        }
        
        return res.status(401).json({ message: "Authentication failed" });
      }
    };

 exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };


