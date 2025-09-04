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
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    report: {type: Number, default: 0},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    usersDisliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    usersReported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('Post', postSchema);