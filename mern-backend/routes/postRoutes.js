const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
const {authMiddleware,adminMiddleware}=require('../middleware/authMiddleware');

router.get('/', async (req,res) => {
    const posts=await Post.find().populate('author','name batch');
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

router.delete('/:id',adminMiddleware,async(req,res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully'});
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
