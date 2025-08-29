const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
const authMiddleware=require('../middleware/authMiddleware');

router.get('/', async (req,res) => {
    const posts=await Post.find().populate('author','name regNo');
    res.json(posts);
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
        res.status(201).json({ message: 'Post created',newPost });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
