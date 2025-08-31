const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader=req.header('Authorization');
    console.log('Authorization header:', authHeader);

    const token=authHeader?.split(' ')[1];
    console.log('Extracted token:', token);

    if(!token){
        return res.status(401).json({ message: 'No token' });
    }

    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    }
    catch(err){
        console.error('JWT verification error:', err.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminMiddleware = (req,res,next) => {
    if(req.user.role!=='admin'){
        return res.status(403).json({ message: 'Access denied: Admins only'})
    }
    next();
}

module.exports={authMiddleware,adminMiddleware};
