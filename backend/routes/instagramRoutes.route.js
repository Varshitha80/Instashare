import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Usercredential,Stories,Posts,Userprofile} from "../models/instagramdetails.model.js";


const router = express.Router()

const verifytoken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid token." });
    }
};


router.post('/register',async (req,res) => {
    const {username,email,password} = req.body

    if(!username || !email || !password) {
        return res.status(400).json({success:false,message:"please provide all fields"});
    }

    const hashedpassword = await bcrypt.hash(password,10);
    const newuserdetails = new Usercredential({username,email,password:hashedpassword})

    try {
        await newuserdetails.save()
        res.status(201).json({sucess:true,data:newuserdetails});
    }
    catch(error){
        res.status(500).json({success:false,message:"server error"});
    }
})

router.post("/login",async (req,res) => {
    const {identifier,password} = req.body 
    try {
        const dbuser = await Usercredential.findOne({
            $or:[{username:identifier},{email:identifier}]
        })

        if(!dbuser){
            res.status(400).json({message:"User does not exist"});
        }
        else{
            const ispasswordmatched = await bcrypt.compare(password,dbuser.password);
            if(ispasswordmatched) {
                const payload = {_id:dbuser._id,username:dbuser.username}
                const jwt_token = jwt.sign(payload,process.env.JWT_SECRET_TOKEN);
                res.json({jwt_token})
            }
            else{
                res.status(400).json({message:"The password is incorrect"})
            }
        }
    }
    catch(error) { 
        res.status(500).json({message:"Internal server error"});
    }
})

router.get("/stories",verifytoken,async (req,res) => {
    try {
        const stories = await Stories.findOne()
        res.json({stories:stories.users_stories})
    }
    catch(error) {
        res.status(500).json({message:"Internal server error"})
    }
})

router.get("/posts", verifytoken, async (req, res) => {
    try {
        const postsdata = await Posts.find();
        res.json({ postsdata });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/posts/:postId/like", verifytoken, async (req, res) => {
    const postId = req.params.postId;
    const { like_status } = req.body;
    try {
        const usersposts = await Posts.findOne(
            { "posts.post_id": postId },
            { posts: { $elemMatch: { post_id: postId } } }
        );
        if(like_status){
            res.status(200).json({message:"Post has been liked"})
        }
        res.status(200).json({usersposts:usersposts.posts})
    }
    catch(error){
        res.status(400)
    }
});

router.post("/profile",verifytoken,async (req,res) => {
    const {user_id,user_name,user_bio} = req.body
    const checking_id = req.user._id;
    try{
    let userprofile = await Userprofile.findOne({user_id})
    if(userprofile) {
        return res.status(400).json({message:"userid already exists"})
    }

    userprofile = new Userprofile({
        checking_id,
        user_id,
        user_bio,
        user_name
    })

    await userprofile.save()
    return res.status(200).json({message:"success"})
}
catch(error){
    return res.status(500).json({message:"internal server error"})
}
})

router.patch('/profile', verifytoken, async (req, res) => {
    const checkingId = req.user._id; 
    const { user_name, user_bio, profile_pic, user_id } = req.body;

    try {
        if (user_id) { 
            const existingUser = await Userprofile.findOne({ user_id, checking_id: { $ne: checkingId } });
            if (existingUser) {
                return res.status(400).json({ message: "User_id already exists" });
            }
        }

        const updateFields = {};
        if (user_name) updateFields.user_name = user_name;
        if (user_bio) updateFields.user_bio = user_bio;
        if (profile_pic) updateFields.profile_pic = profile_pic;
        if (user_id) updateFields.user_id = user_id;

        const profile = await Userprofile.findOneAndUpdate(
            { checking_id: checkingId }, 
            { $set: updateFields }, 
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/profile/story',verifytoken,async (req,res) => {
    const checkingId = req.user._id;
    const {image} = req.body
    if(!image){
        return res.status(400).json({message:"Please provide an image URL."});
    }
    try {
        const profile = await Userprofile.findOneAndUpdate(
            {checking_id:checkingId},
            {$push:{stories:{image}}},
            {new:true}
        )
        if (!profile){
            return res.status(404).json({message:"User profile not found"});
        }
        res.status(200).json({message:'Story added successfully'})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
})

router.patch('/profile/post',verifytoken,async (req,res) => {
    const checkingId = req.user._id;
    const {image} = req.body
    if(!image){
        return res.status(400).json({message:"Please provide an image URL."});
    }
    try {
        const profile = await Userprofile.findOneAndUpdate(
            {checking_id:checkingId},
            {$push:{posts:{image}}},
            {new:true}
        )
        if (!profile){
            return res.status(404).json({message:"User profile not found"});
        }
        res.status(200).json({message:'post added successfully'})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
})


router.get('/profile',verifytoken,async (req,res) => {
    const checking_id = req.user._id; // Get the user ID from the token
    try {
        // Fetch the user profile using the checking_id
        const profile = await Userprofile.findOne({ checking_id });

        if (!profile) {
            return res.status(404).json({ message: "User profile not found." });
        }

        // Return the user profile data
        return res.status(200).json({ profile });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error." });
    }
})
export default router