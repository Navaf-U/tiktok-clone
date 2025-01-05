import mongoose from mongoose

const postsSchema = mongoose.Schema({
    username:{type: String, required: true},
    description:{type: String, required: false},
    file:{type: String, required: true},
    date:{type: Date, default: Date.now},
    likes:{type: [String], default: []},
    comments:{type: [String],default: []},
    favorites:{type: [String],default: []},
})

const Posts = mongoose.model("Posts", postsSchema)
export default Posts