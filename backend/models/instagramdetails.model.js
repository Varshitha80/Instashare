import mongoose, { MongooseError } from "mongoose";

const usercredentialsSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const storySchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    user_name:{
        type:String,
        required:true,
    },
    story_url:{
        type:String,
        required:true,
    },
});

const storiesSchema = new mongoose.Schema({
    users_stories:[storySchema]
})

const commentSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
    },
    user_id : {
        type:String,
        required:true
    },
    comment : {
        type:String,
        required:true
    },
},
{
    _id:false
})

const postdetailsSchema = new mongoose.Schema({
    image_url: {
        type:String,
        required:true,
    },
    caption:{
        type:String,
        required:true
    },
},
{ 
    _id:false
})


const postsSchema = new mongoose.Schema({
    post_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  user_name: { type: String, required: true },
  profile_pic: { type: String, required: true },
  post_details: { type: postdetailsSchema, required: true },
  likes_count: { type: Number, default: 0 },
  comments: [commentSchema],
  created_at: { type: String, required: true }, 
}, { timestamps: true 
})

const userpostsSchema = new mongoose.Schema({
    image:{type:String}
})

const userstoriesSchema = new mongoose.Schema({
    image:{type:String}
})



const userprofileSchema = new mongoose.Schema({
    checking_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Usercredential'
    },
    user_id:{type:String,required:true,unique:true},
    user_name:{type:String,required:true},
    profile_pic:{type:String,
        default:"https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid"
    },
    followers_count:{type:Number,default:0},
    following_count:{type:Number,default:0},
    user_bio:{type:String,required:true},
    posts:{type:[userpostsSchema],default:[]},
    stories:{type:[userstoriesSchema],default:[]}
},{
    timestamps:true
})
const Posts = mongoose.model('Post',postsSchema)
const Usercredential = mongoose.model('Usercredential',usercredentialsSchema);
const Stories = mongoose.model('Storie',storiesSchema)
const Userprofile = mongoose.model('Userprofile',userprofileSchema)

export {Usercredential,Stories,Posts,Userprofile};


