const { text } = require("express")
const db=require("../db/queries")
const {body,validationResult}=require("express-validator")
const commentValidateRules=[
    body("text").trim().notEmpty().withMessage("Text musn't be empty.")
]

const createComment=async (req,res,next)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty())return res.status(400).json({errors:errors.array()})
        const blogId=Number(req.params.blogId)
        if(isNaN(blogId))return res.status(404).json({message:"Blog not found."})
        const blog=await db.getBlogById(blogId)
        if(!blog||(!blog.isPublished && blog.authorId !== req.user?.id))return res.status(404).json({message:"Blog not found or not published."})
        const comment=await db.createComment({
            text:req.body.text,
            authorId:req.user.id,
            blogId:blog.id
        })
        res.json({comment})
    }catch(err){
        next(err)
    }
}

const getCommentsByBlogId=async (req,res,next)=>{
    try{
        const blogId=Number(req.params.blogId)
        if(isNaN(blogId))return res.status(404).json({message:"Blog not found."})
        const blog=await db.getBlogById(blogId)
        if(!blog||(!blog.isPublished && blog.authorId !== req.user?.id))return res.status(404).json({message:"Blog not found."})
        const comments=await db.getCommentsByBlogId(blogId)
        res.json({comments})
    }catch(err){
        next(err)
    }
}

const loadComment=async (req ,res ,next)=>{
    try{
        const id=Number(req.params.commentId)
        if(isNaN(id))return res.status(404).json({message:"Comment not found."})
        const comment=await db.getCommentById(id)
        if(!comment)return res.status(404).json({message:"Comment not found."})
        req.comment=comment
        next()
    }catch(err){
        next(err)
    }
}

const deleteComment=async (req,res,next)=>{
    try{
        if(req.comment.authorId!==req.user.id && req.comment.blog.authorId!==req.user.id){
            return res.status(403).json({message:"Frobidden."})
        }
        await db.deleteComment(req.comment.id)
        res.json({message:"Comment deleted!"})
    }catch(err){
        next(err)
    }
}

const editComment=async (req,res,next)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const data={text:req.body.text}
        const comment=await db.editComment(req.comment.id,data)
        res.json({comment})
    }catch(err){
        next(err)
    }
}

const getCommentById=async(req,res,next)=>{
    try{
        const commentId=Number(req.params.commentId)
        if(isNaN(commentId))return res.status(404).json({message:"Comment not found."})
        const comment=await db.getCommentById(commentId)
        // must run after the user is loaded. verifyToken
        if(!comment || comment.authorId!==req.user.id){
            return res.status(404).json({message:"Comment not found."})
        }
        res.json({comment})
    }catch(err){
        next(err)
    }
}
module.exports={
    commentValidateRules,
    createComment,
    getCommentsByBlogId,
    loadComment,
    deleteComment,
    editComment,
    getCommentById,
}