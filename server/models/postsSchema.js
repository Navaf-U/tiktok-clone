import mongoose from 'mongoose'

const postsSchema = mongoose.Schema({
    username:{type: String, required: true},
    description:{type: String, required: false},
    file:{type: String, required: true},
    date:{type: Date, default: Date.now},
    likes:{type: [String], default: []},
    comments: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          text: { type: String, required: true },                     
          createdAt: { type: Date, default: Date.now },               
        },
      ],
    favorites:{type: [String],default: []},
})

const Posts = mongoose.model("Posts", postsSchema)
export default Posts