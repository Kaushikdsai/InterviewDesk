const redis=require("../config/redis");

function cacheMiddleware(keyPrefix){
    return async (req,res,next) => {
        try{
            const queryKey=JSON.stringify(req.query);
            const key=keyPrefix+(req.params.id || queryKey || "all");

            res.locals.cacheKey=key;

            const cachedData=await redis.get(key);
            if(cachedData){
              return res.json(JSON.parse(cachedData));
            }

            next();
        }
        catch(err){
            console.error("Cache middleware error:", err);
            next();
        }
    };
}

module.exports = cacheMiddleware;
