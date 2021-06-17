import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"


export const getPosts = async (req,res)=>{
    try{
        const postMessages = await PostMessage.find().sort({'createdAt': -1})
        res.status(200).json(postMessages)
    }
    catch(error){
        res.status(404).json({
            message: error.message
        })
    }
}

export const createPosts = async (req,res)=>{
    const post  = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
    
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message:error.message})
    }
}

export const updatePost = async (req,res)=>{
    const {id: _id} = req.params; //or const id = req.params.id //{id: _id} renames id to _id
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("No post found with the given id!");
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id,{...post, _id},{new:true } )   
    res.json(updatedPost) 
     
}

export const deletePost = async(req,res)=>{
    const {id: _id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("No post found with the given id!");
    }
    await PostMessage.findByIdAndRemove(_id);
    res.json({
        message: "Post deleted successfully!"
    })
}

export const likePost = async(req,res)=>{
    const {id: _id} = req.params;

    if(!req.userId) return res.json({
        message:"Unauthenticated!"
    })
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("No post found with the given id!");
    }
    const post = await PostMessage.findById(_id);

    const index  = post.likes.findIndex((id)=> id === String(req.userId)); //check if there already is a like with user's id
    if(index === -1){//if not
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter((id)=> id!== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new:true});

    res.json(updatedPost);
}