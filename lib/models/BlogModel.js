import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    authorImg: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    views: {
        type: Number,
        default: 0
    },
    viewsHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        count: {
            type: Number,
            default: 1
        }
    }]
}, {
    timestamps: true
})

const BlogModel = mongoose.models.blog || mongoose.model('blog', Schema);

export default BlogModel;