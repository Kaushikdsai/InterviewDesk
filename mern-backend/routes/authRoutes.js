const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const router=express.Router();
const User=require('../models/User');

router.post('/register', async (req,res) => {
    try{
        const {name,contact,regNo,batch,email,password}=req.body;
        const user=await User.findOne({regNo});
        if(user){
            return res.status(400).json({ messgae: 'User already exists!' });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({ name,contact,regNo,batch,email,password: hashedPassword });
        await newUser.save();
        const token=jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ message: 'User registered',token });
    }
    catch(err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message });
    }

})

router.post('/login',async(req,res) => {
    try{
        const {regNo,password}=req.body;
        const user=await User.findOne({regNo});
        if(!user){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token=jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.json({ message: 'Login successful', token });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports=router;