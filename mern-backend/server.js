require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const authRoutes=require('./routes/authRoutes');
const postRoutes=require('./routes/postRoutes');
const rateLimiter = require("./middleware/rateLimiter");
const { authMiddleware, adminMiddleware } = require('./middleware/authMiddleware');
const app=express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use('/api',authRoutes);
app.use('/api/posts',postRoutes);

const mongoURI=process.env.MONGO_URI;

mongoose.connect(mongoURI,{
    maxPoolSize: 100,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Error:', err));
const PORT=process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})