const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
const { authMiddleware,adminMiddleware }=require('../middleware/authMiddleware');

router.get('/',async (req, res) => {
    try{
        const { role, company, status } = req.query;

        let query = {};
        if (role) query.role = { $regex: role, $options: 'i' };
        if (company) query.company = { $regex: company, $options: 'i' };
        if (status) query.status = { $regex: status, $options: 'i' };

        const posts=await Post.find(query).populate('author', 'name batch');

        res.json(posts);
    }
    catch(err){
        console.error("GET POSTS ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

/* =======================
   CREATE POST
======================= */
router.post('/', authMiddleware, async (req, res) => {
    try{
        const { company, role, status, experience, questions, additionalInfo }=req.body;

        const newPost=new Post({
            company,
            role,
            status,
            experience,
            questions,
            additionalInfo,
            author: req.user.id
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created', newPost });
    } 
    catch(err){
      console.error("CREATE POST ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
});

/* =======================
   GET POST BY ID
======================= */
router.get('/:id', async (req, res) => {
    try{
      const post=await Post.findById(req.params.id);

      if(!post){
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } 
    catch(err){
      console.error("GET POST ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
});

/* =======================
   DELETE POST (ADMIN)
======================= */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: 'Post deleted successfully' });
    } 
    catch(err){
      console.error("DELETE POST ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
});

/* =======================
   REACTIONS
======================= */
router.patch('/:id/reaction', authMiddleware, async (req, res) => {
    try{
      const { type }=req.body;
      const userId=req.user.id;
      const currPost=await Post.findById(req.params.id);
      if(!currPost){
          return res.status(404).json({ message: "Post not found" });
      }

      if(type==='like'){
          if(currPost.usersLiked.includes(userId)) {
            currPost.usersLiked=currPost.usersLiked.filter(id => id.toString() !== userId);
          }
          else{
            currPost.usersDisliked=currPost.usersDisliked.filter(id => id.toString() !== userId);
            currPost.usersLiked.push(userId);
          }
      }

      if (type === 'dislike') {
        if (currPost.usersDisliked.includes(userId)) {
          currPost.usersDisliked = currPost.usersDisliked.filter(id => id.toString() !== userId);
        } else {
          currPost.usersLiked = currPost.usersLiked.filter(id => id.toString() !== userId);
          currPost.usersDisliked.push(userId);
        }
      }

      if (type === 'report') {
        if (!currPost.usersReported.includes(userId)) {
          currPost.usersReported.push(userId);
        } else {
          currPost.usersReported = currPost.usersReported.filter(id => id.toString() !== userId);
        }
      }

      currPost.likes = currPost.usersLiked.length;
      currPost.dislikes = currPost.usersDisliked.length;
      currPost.report = currPost.usersReported.length;

      await currPost.save();

      res.json(currPost);
    } 
    catch(err){
      console.error("REACTION ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
});

module.exports = router;
