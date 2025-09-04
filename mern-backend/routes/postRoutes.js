const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
const {authMiddleware,adminMiddleware}=require('../middleware/authMiddleware');
const redis=require('../config/redis');
const cacheMiddleware=require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware("posts:"), async (req,res) => {
    try{
        const {role,company,status,name,batch}=req.query;
        console.log(req.query);
        let query={};
        if(role) query.role={$regex: role, $options: 'i'}
        if(company) query.company={$regex: company, $options: 'i'}
        if(status) query.status={$regex: status, $options: 'i'}
        if(name) query.name={$regex: name, $options: 'i'}
        if(batch) query.batch={$regex: batch, $options: 'i'}
        
        const posts=await Post.find(query).populate('author','name batch');
        await redis.setex(res.locals.cacheKey,3600,JSON.stringify(posts));
        console.log("Cached data at:", res.locals.cacheKey);
        res.json(posts);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
})

router.post('/', authMiddleware, async (req,res) => {
    try{
        const {company,role,status,experience,questions,additionalInfo}=req.body;
        const newPost=new Post({
            company,
            role,
            status,
            experience,
            questions,
            additionalInfo,
            author: req.user.id
        }) 
        await newPost.save();
        await redis.del("posts:all");
        res.status(201).json({ message: 'Post created',newPost });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async(req,res) => {
    const id=req.params.id;
    const post=await Post.findById(id);
    if(post){
        await redis.setex(res.locals.cacheKey,3600,JSON.stringify(post));
        return res.json(post);
    }
    else{
        res.status(500).json({ message: err.message });
    }
})

router.delete('/:id',authMiddleware,adminMiddleware,async(req,res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        await redis.del("posts:all");
        await redis.del(`posts:${req.params.id}`);
        res.json({ message: 'Post deleted successfully'});
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/reaction', authMiddleware, async (req,res) => {
    try{
        const {id}=req.params;
        const {type}=req.body;
        const userId=req.user.id;

        const currPost=await Post.findById(id);

        if(!currPost){
            return res.status(404).json({ message: "Post not found"});
        }

        if(type==='like'){
            if(currPost.usersLiked.includes(userId)){
                currPost.usersLiked=currPost.usersLiked.filter(uId => uId.toString()!==userId);
            }
            else{
                currPost.usersDisliked=currPost.usersDisliked.filter(uId => uId.toString()!==userId);
                currPost.usersLiked.push(userId);
            }
        }

        if(type==='dislike'){
            if(currPost.usersDisliked.includes(userId)){
                currPost.usersDisliked=currPost.usersDisliked.filter(uId => uId.toString()!==userId);
            }
            else{
                currPost.usersLiked=currPost.usersLiked.filter(uId => uId.toString()!==userId);
                currPost.usersDisliked.push(userId);
            }
        }

        if(type==='report'){
            if(!currPost.usersReported.includes(userId)){
                currPost.usersReported.push(userId);
            }
            else{
                currPost.usersReported=currPost.usersReported.filter(uId => uId.toString()!==userId);
            }
        }

        currPost.likes=currPost.usersLiked.length;
        currPost.dislikes=currPost.usersDisliked.length;
        currPost.report=currPost.usersReported.length;

        await currPost.save();
        await redis.del('posts:all');
        await redis.del(`posts:${id}`);
        res.json(currPost);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
