const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    company: {type: String, required: true},
    role: {type: String, required: true},
    status: {
        type: String,
        enum: ['Accepted','Declined','Rejected'],
        required: true
    },
    experience: {type: String, required: true},
    questions: [String],
    additionalInfo: String,
    likes: Number,
    dislikes: Number,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Post', postSchema);